// Real VIP-TAXI usage, from the existing audit log (app_audit) + accounts.
// Read-only. Pseudonymous: no names, emails or IPs leave this layer — only counts.
//
// Excluded: shared / test accounts (source = 'staff_json'). Kept: the owner
// (source 'env') and real operators (source 'admin'), per the agreed scope.
// NOTE: this is AUDITED ACTIONS only (search / open / edit / login ...). Plain
// page & tab views are NOT audited, so quiet browsing is invisible here — that
// needs the (currently paused) in-app tracking.
import { vipQuery } from "@/lib/vipdb";

const EXCLUDE = "u.source <> 'staff_json'"; // drop shared/test accounts

// Audited action -> human label (Uzbek).
const ACTION_LABEL: Record<string, string> = {
  "driver.search": "Haydovchi qidiruv",
  "driver.open": "Haydovchi kartasi ochildi",
  "driver.edit": "Haydovchi tahrirlandi",
  "driver.unlock": "Blokdan chiqarildi",
  "driver.limit": "Limit o'zgartirildi",
  "chat.send": "Chat xabari",
  "auth.login": "Kirish",
  "auth.logout": "Chiqish",
  "auth.request": "Kirish so'rovi",
  "auth.approve": "Kirish tasdiqlandi",
  "auth.code_sent": "Kod yuborildi",
  "role.update": "Rol o'zgartirildi",
  "user.create": "Xodim qo'shildi",
  "user.sessions_end": "Sessiyalar tugatildi",
  "office.open": "Ofis ochildi",
  "office.close": "Ofis yopildi",
  "alert.night_login": "Ogohlantirish · tunda kirish",
  "alert.new_device": "Ogohlantirish · yangi qurilma",
  "alert.wrong_password": "Ogohlantirish · noto'g'ri parol",
};
const label = (a: string) => ACTION_LABEL[a] ?? a;

export type VipDetail = {
  totalEvents: number;
  rangeFrom: string | null;
  rangeTo: string | null;
  activeAccounts: number;
  activeOperators: number;
  operatorSeats: number;
  weeklyActive: number;
  actions: { label: string; value: number; note?: string }[];
  adoption: { week: string; active: number }[];
  parks: { label: string; value: number }[];
};

type CountRow = { n: number };

export async function getVipDetail(): Promise<VipDetail> {
  const base = `from app_audit a join app_users u on u.id = a.actor_user_id where ${EXCLUDE}`;

  const [totals] = await vipQuery<{ n: number; mn: string | null; mx: string | null }>(
    `select count(*)::int n, min(a.at)::date::text mn, max(a.at)::date::text mx ${base}`,
  );

  const [accounts] = await vipQuery<CountRow>(`select count(distinct a.actor_user_id)::int n ${base}`);

  const [ops] = await vipQuery<CountRow>(
    `select count(distinct a.actor_user_id)::int n ${base} and u.source='admin' and (select key from app_roles r where r.id=u.role_id)='operator'`,
  );

  const [seats] = await vipQuery<CountRow>(
    `select count(*)::int n from app_users u join app_roles r on r.id=u.role_id
       where u.source='admin' and r.key='operator' and u.status='active'`,
  );

  const [weekly] = await vipQuery<CountRow>(
    `select count(distinct a.actor_user_id)::int n ${base} and a.at >= now() - interval '7 days'`,
  );

  const actions = await vipQuery<{ action: string; n: number }>(
    `select a.action, count(*)::int n ${base} group by a.action order by n desc limit 12`,
  );

  const adoption = await vipQuery<{ wk: string; active: number }>(
    `select to_char(date_trunc('week', a.at at time zone 'Asia/Tashkent'),'DD Mon') wk,
            count(distinct a.actor_user_id)::int active
       ${base} group by date_trunc('week', a.at at time zone 'Asia/Tashkent')
       order by date_trunc('week', a.at at time zone 'Asia/Tashkent')`,
  );

  // Parks: only park-scoped (driver.*) events carry park_id. Label by a short tag
  // + driver count until the park names are mapped.
  const parks = await vipQuery<{ park_id: string; n: number; drivers: number }>(
    `select a.park_id,
            count(*)::int n,
            coalesce((select count(*)::int from drivers d where d.park_id = a.park_id), 0) drivers
       ${base} and a.park_id is not null
       group by a.park_id order by n desc limit 6`,
  );

  return {
    totalEvents: totals?.n ?? 0,
    rangeFrom: totals?.mn ?? null,
    rangeTo: totals?.mx ?? null,
    activeAccounts: accounts?.n ?? 0,
    activeOperators: ops?.n ?? 0,
    operatorSeats: seats?.n ?? 0,
    weeklyActive: weekly?.n ?? 0,
    actions: actions.map((a) => ({ label: label(a.action), value: a.n })),
    adoption: adoption.map((d) => ({ week: d.wk, active: d.active })),
    parks: parks.map((p) => ({
      label: `Park ·${p.park_id.slice(-6)} (${fmtK(p.drivers)} hayd.)`,
      value: p.n,
    })),
  };
}

function fmtK(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
