-- Khadeeja Empire admin foundation schema.
-- Run this file manually in the Supabase SQL editor. No application code runs it.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id text primary key default gen_random_uuid()::text,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists categories (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  description text,
  image text,
  parent_id text references categories(id) on delete set null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists collections (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  description text,
  image text,
  hero_copy text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  description text,
  short_description text,
  category_id text references categories(id) on delete set null,
  category_slug text references categories(slug) on delete set null,
  collection_id text references collections(id) on delete set null,
  collection_slug text references collections(slug) on delete set null,
  video text,
  hover_image text,
  price numeric(12, 2) not null default 0,
  old_price numeric(12, 2),
  currency text not null default 'INR',
  price_status text not null default 'demo' check (price_status in ('demo', 'confirmed')),
  sizes text[] not null default '{}',
  tags text[] not null default '{}',
  availability text not null default 'out-of-stock' check (availability in ('in-stock', 'low-stock', 'out-of-stock')),
  source_post_id text,
  source_url text,
  is_prototype_data boolean not null default false,
  badge text check (badge is null or badge in ('new', 'featured', 'sale')),
  active boolean not null default true,
  featured boolean not null default false,
  seo jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists product_colors (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references products(id) on delete cascade,
  name text not null,
  hex text,
  active boolean not null default true,
  sort_order integer not null default 0,
  unique (product_id, name)
);

create table if not exists product_variants (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references products(id) on delete cascade,
  name text,
  sku text unique,
  size text,
  color_id text references product_colors(id) on delete set null,
  price numeric(12, 2),
  stock integer not null default 0,
  active boolean not null default true
);

create table if not exists product_images (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references products(id) on delete cascade,
  url text not null,
  alt_text text,
  type text not null default 'image' check (type in ('image', 'video')),
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists product_information (
  id text primary key default gen_random_uuid()::text,
  product_id text not null unique references products(id) on delete cascade,
  details text,
  fabric text,
  care text,
  fit text,
  shipping text,
  seo jsonb
);

create table if not exists customers (
  id text primary key default gen_random_uuid()::text,
  profile_id text references profiles(id) on delete set null,
  name text,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  order_count integer not null default 0,
  total_spent numeric(12, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists customers_phone_unique_idx
  on customers (phone);

create table if not exists addresses (
  id text primary key default gen_random_uuid()::text,
  customer_id text references customers(id) on delete cascade,
  order_id text,
  label text,
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'IN',
  phone text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists orders (
  id text primary key default gen_random_uuid()::text,
  order_number text not null unique,
  customer_id text references customers(id) on delete set null,
  profile_id text references profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  currency text not null default 'INR',
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  coupon_code text,
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  product_slug text,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null default 0,
  total_price numeric(12, 2) not null default 0,
  size text,
  color text,
  image text
);

create table if not exists reviews (
  id text primary key default gen_random_uuid()::text,
  product_id text references products(id) on delete cascade,
  customer_id text references customers(id) on delete set null,
  author_name text not null,
  author_email text,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_home_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists inquiries (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists subscribers (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  name text,
  active boolean not null default true,
  source text,
  subscribed_at timestamptz not null default timezone('utc', now())
);

create table if not exists hero_slides (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text,
  image text not null,
  image_alt text,
  video text,
  cta text,
  cta_link text,
  collection_slug text,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists instagram_posts (
  id text primary key,
  caption text,
  hashtags text[] not null default '{}',
  short_code text,
  source_url text,
  type text check (type is null or type in ('Image', 'Video', 'Sidecar')),
  image text not null,
  video text,
  timestamp text,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists testimonials (
  id text primary key default gen_random_uuid()::text,
  author_name text not null,
  quote text not null,
  role text,
  image text,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists faqs (
  id text primary key default gen_random_uuid()::text,
  question text not null,
  answer text not null,
  category text,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists announcements (
  id text primary key default gen_random_uuid()::text,
  text text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz
);

create table if not exists settings (
  id text primary key default gen_random_uuid()::text,
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists coupons (
  id text primary key default gen_random_uuid()::text,
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12, 2) not null check (discount_value > 0),
  minimum_amount numeric(12, 2),
  maximum_uses integer,
  used_count integer not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz
);

create table if not exists shipping_rates (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  amount numeric(12, 2) not null default 0,
  free_above numeric(12, 2),
  cod_available boolean not null default false,
  active boolean not null default true
);

create table if not exists promo_settings (
  id text primary key,
  enabled boolean not null default false,
  title text,
  body text,
  image text,
  cta_label text,
  cta_link text,
  coupon_code text,
  frequency text check (frequency is null or frequency in ('once', 'session', 'always')),
  max_views integer,
  ends_at timestamptz
);

create table if not exists discovery_menu_entries (
  id text primary key default gen_random_uuid()::text,
  label text not null,
  href text not null,
  category_id text references categories(id) on delete set null,
  active boolean not null default true,
  sort_order integer not null default 0
);

create index if not exists products_category_slug_idx on products(category_slug);
create index if not exists products_active_idx on products(active);
create index if not exists product_images_product_idx on product_images(product_id, sort_order);
create index if not exists product_variants_product_idx on product_variants(product_id);
create index if not exists orders_status_idx on orders(status, created_at desc);
create index if not exists orders_customer_idx on orders(customer_id);
create index if not exists reviews_product_status_idx on reviews(product_id, status);
create index if not exists inquiries_status_idx on inquiries(status, created_at desc);
create index if not exists announcements_order_idx on announcements(active, sort_order);

-- RLS keeps public storefront reads narrow. The service-role client bypasses RLS for admin work.
alter table products enable row level security;
alter table categories enable row level security;
alter table collections enable row level security;
alter table product_images enable row level security;
alter table hero_slides enable row level security;
alter table instagram_posts enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table announcements enable row level security;
alter table profiles enable row level security;
alter table customers enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table inquiries enable row level security;
alter table subscribers enable row level security;
alter table settings enable row level security;
alter table coupons enable row level security;
alter table shipping_rates enable row level security;
alter table promo_settings enable row level security;
alter table discovery_menu_entries enable row level security;
alter table product_colors enable row level security;
alter table product_variants enable row level security;
alter table product_information enable row level security;

drop policy if exists "public active products" on products;
create policy "public active products" on products for select to anon, authenticated using (active = true);
drop policy if exists "public active categories" on categories;
create policy "public active categories" on categories for select to anon, authenticated using (active = true);
drop policy if exists "public active collections" on collections;
create policy "public active collections" on collections for select to anon, authenticated using (active = true);
drop policy if exists "public product images" on product_images;
create policy "public product images" on product_images for select to anon, authenticated using (exists (select 1 from products where products.id = product_images.product_id and products.active = true));
drop policy if exists "public active hero slides" on hero_slides;
create policy "public active hero slides" on hero_slides for select to anon, authenticated using (active = true);
drop policy if exists "public active instagram posts" on instagram_posts;
create policy "public active instagram posts" on instagram_posts for select to anon, authenticated using (active = true);
drop policy if exists "public active testimonials" on testimonials;
create policy "public active testimonials" on testimonials for select to anon, authenticated using (active = true);
drop policy if exists "public active faqs" on faqs;
create policy "public active faqs" on faqs for select to anon, authenticated using (active = true);
drop policy if exists "public active announcements" on announcements;
create policy "public active announcements" on announcements for select to anon, authenticated using (active = true);

-- All other tables intentionally have no anon/authenticated policies. Use the server-only service role for admin operations.
