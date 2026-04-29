-- ============================================================
-- honbone schema (run in Supabase SQL Editor)
-- ============================================================

-- ----- products
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  sku           text unique not null,
  name          text not null,
  price         integer not null,                 -- JPY (税込)
  stock         integer not null default 0,
  edition_total integer,
  image_url     text,
  image_alt_url text,
  badge         text,
  status        text not null default 'active',   -- active / sold_out / hidden
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ----- orders
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  stripe_session_id     text unique,
  stripe_payment_intent text,
  status                text not null default 'pending', -- pending / paid / shipped / cancelled / refunded
  subtotal              integer not null,
  shipping_fee          integer not null default 0,
  total                 integer not null,
  customer_email        text not null,
  customer_phone        text,
  customer_name         text,
  shipping_postal       text,
  shipping_prefecture   text,
  shipping_city         text,
  shipping_line1        text,
  shipping_line2        text,
  created_at            timestamptz not null default now(),
  paid_at               timestamptz
);

-- ----- order_items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id),
  sku         text not null,
  name        text not null,
  price       integer not null,
  quantity    integer not null
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- products: anyone can read active rows
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (status = 'active');

-- orders / order_items: server (secret key) only — no policies for anon
-- (RLS denies all when no policy matches)

-- ============================================================
-- Seed: 8 products
-- ============================================================
insert into public.products (sku, name, price, stock, edition_total, image_url, image_alt_url, badge, status, sort_order) values
  ('BREE-ERT-001', 'BONE KEYRING',    18400, 240, 240, '/assets/02.png', '/assets/01.png', 'DROP 001', 'active', 1),
  ('BREE-ERT-002', 'RIB PENDANT',     14200, 180, 180, '/assets/04.png', '/assets/05.png', 'NEW',      'active', 2),
  ('BREE-ERT-003', 'SPINE STRAP',     22800, 120, 120, '/assets/05.png', '/assets/02.png', 'NEW',      'active', 3),
  ('BREE-ERT-004', 'CARPAL RING / S',  9600, 320, 320, '/assets/01.png', '/assets/06.png', '',         'active', 4),
  ('BREE-ARC-005', 'PELVIS OBJECT',   34000,  80,  80, '/assets/06.png', '/assets/02.png', 'EDITION',  'active', 5),
  ('BREE-ERT-006', 'KNUCKLE FOB',     11800, 240, 240, '/assets/03.png', '/assets/04.png', '',         'active', 6),
  ('BREE-ERT-007', 'JAW CLIP',         8400, 400, 400, '/assets/01.png', '/assets/02.png', '',         'active', 7),
  ('BREE-ARC-008', 'CRANIUM SHELF',   48000,   1,   1, '/assets/02.png', '/assets/06.png', '1 OF 1',   'active', 8)
on conflict (sku) do update set
  name = excluded.name,
  price = excluded.price,
  stock = excluded.stock,
  edition_total = excluded.edition_total,
  image_url = excluded.image_url,
  image_alt_url = excluded.image_alt_url,
  badge = excluded.badge,
  sort_order = excluded.sort_order;
