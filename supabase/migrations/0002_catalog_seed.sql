insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('pulsa', 'Pulsa', 'Pulsa', 'Isi ulang pulsa semua operator', 'call', 'Pulsa', false, 'Nomor handphone', '08xxxxxxxxxx', 'Pastikan nomor aktif untuk menerima SMS konfirmasi.', true, 9, 13, 1, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('data', 'Paket Data', 'Paket Data', 'Kuota internet harian & bulanan', 'wifi', 'Paket Data', false, 'Nomor handphone', '08xxxxxxxxxx', 'Kuota aktif setelah pembayaran terverifikasi.', true, 9, 13, 2, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('ewallet', 'Uang Elektronik', 'Uang Elektronik', 'Saldo DANA, GoPay, OVO & lainnya', 'wallet', 'Saldo', false, 'Nomor akun uang elektronik', '08xxxxxxxxxx', 'Saldo masuk penuh tanpa potongan biaya admin.', true, 9, 13, 3, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('pln', 'PLN', 'PLN', 'Token listrik & tagihan pascabayar', 'bolt', 'Token Listrik', false, 'Nomor meter / ID pelanggan', '14xxxxxxxxxx', 'Struk token 20 digit akan tampil setelah pembayaran selesai.', false, 11, 12, 4, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('internet', 'Pembayaran Internet', 'Pembayaran Internet', 'Tagihan internet rumah bulanan', 'router', 'Pembayaran Internet', true, 'Nomor pelanggan internet', 'Masukkan nomor pelanggan', 'Nominal mengikuti tagihan bulanan pada provider terpilih.', false, 6, 16, 5, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('bpjs', 'BPJS', 'BPJS', 'Iuran BPJS Kesehatan bulanan', 'health_and_safety', 'Iuran BPJS', true, 'Nomor kartu BPJS', '13 digit nomor kartu', 'Periksa nama & jumlah anggota keluarga sebelum membayar.', false, 10, 16, 6, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('multifinance', 'Multifinance', 'Multifinance', 'Angsuran cicilan kendaraan & lainnya', 'payments', 'Angsuran', true, 'Nomor kontrak', 'Masukkan nomor kontrak', 'Nominal mengikuti angsuran jatuh tempo pada kontrakmu.', false, 6, 16, 7, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.categories (slug, name, short, blurb, icon, product_prefix, is_bill, dest_label, dest_placeholder, dest_hint, phone_input, min_digits, max_digits, sort_order, is_active)
values ('pdam', 'PDAM', 'PDAM', 'Tagihan air PDAM per wilayah', 'water_drop', 'Tagihan Air', true, 'Nomor pelanggan air', 'Masukkan nomor pelanggan', 'Nominal mengikuti pemakaian air bulan berjalan.', false, 6, 16, 8, true)
on conflict (slug) do update set name = excluded.name, short = excluded.short, blurb = excluded.blurb, icon = excluded.icon, product_prefix = excluded.product_prefix, is_bill = excluded.is_bill, dest_label = excluded.dest_label, dest_placeholder = excluded.dest_placeholder, dest_hint = excluded.dest_hint, phone_input = excluded.phone_input, min_digits = excluded.min_digits, max_digits = excluded.max_digits, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'telkomsel', 'Telkomsel', 'TSEL', '#e31837', 1, true from public.categories c where c.slug = 'pulsa'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'indosat', 'Indosat', 'ISAT', '#006491', 2, true from public.categories c where c.slug = 'pulsa'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'xl', 'XL Axiata', 'XL', '#013c5b', 3, true from public.categories c where c.slug = 'pulsa'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'tri', 'Tri', 'TRI', '#3d566a', 4, true from public.categories c where c.slug = 'pulsa'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'smartfren', 'Smartfren', 'SF', '#e31837', 5, true from public.categories c where c.slug = 'pulsa'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'telkomsel', 'Telkomsel', 'TSEL', '#e31837', 1, true from public.categories c where c.slug = 'data'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'indosat', 'Indosat', 'ISAT', '#006491', 2, true from public.categories c where c.slug = 'data'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'xl', 'XL Axiata', 'XL', '#013c5b', 3, true from public.categories c where c.slug = 'data'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'tri', 'Tri', 'TRI', '#3d566a', 4, true from public.categories c where c.slug = 'data'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'smartfren', 'Smartfren', 'SF', '#e31837', 5, true from public.categories c where c.slug = 'data'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'dana', 'DANA', 'DANA', '#006491', 1, true from public.categories c where c.slug = 'ewallet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'gopay', 'GoPay', 'GOPAY', '#013c5b', 2, true from public.categories c where c.slug = 'ewallet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'ovo', 'OVO', 'OVO', '#3d566a', 3, true from public.categories c where c.slug = 'ewallet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'shopeepay', 'ShopeePay', 'SPAY', '#e31837', 4, true from public.categories c where c.slug = 'ewallet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'linkaja', 'LinkAja', 'LINK', '#e31837', 5, true from public.categories c where c.slug = 'ewallet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'pln-prabayar', 'PLN Prabayar', 'PRA', '#006491', 1, true from public.categories c where c.slug = 'pln'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'pln-pascabayar', 'PLN Pascabayar', 'PASCA', '#013c5b', 2, true from public.categories c where c.slug = 'pln'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'indihome', 'IndiHome', 'INDI', '#e31837', 1, true from public.categories c where c.slug = 'internet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'biznet', 'Biznet', 'BIZ', '#006491', 2, true from public.categories c where c.slug = 'internet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'firstmedia', 'First Media', 'FM', '#013c5b', 3, true from public.categories c where c.slug = 'internet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'myrepublic', 'MyRepublic', 'MR', '#3d566a', 4, true from public.categories c where c.slug = 'internet'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'bpjs-kesehatan', 'BPJS Kesehatan', 'BPJS', '#006491', 1, true from public.categories c where c.slug = 'bpjs'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'fif', 'FIF', 'FIF', '#006491', 1, true from public.categories c where c.slug = 'multifinance'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'acc', 'ACC', 'ACC', '#013c5b', 2, true from public.categories c where c.slug = 'multifinance'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'mpm', 'MPM Finance', 'MPM', '#3d566a', 3, true from public.categories c where c.slug = 'multifinance'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'baf', 'BAF', 'BAF', '#e31837', 4, true from public.categories c where c.slug = 'multifinance'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'aetra', 'Aetra', 'AET', '#006491', 1, true from public.categories c where c.slug = 'pdam'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'palyja', 'Palyja', 'PLY', '#013c5b', 2, true from public.categories c where c.slug = 'pdam'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;
insert into public.providers (category_id, slug, name, code, swatch, sort_order, is_active)
select c.id, 'tirta-musi', 'Tirta Musi', 'TIRT', '#3d566a', 3, true from public.categories c where c.slug = 'pdam'
on conflict (category_id, slug) do update set name = excluded.name, code = excluded.code, swatch = excluded.swatch, sort_order = excluded.sort_order;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-p5000', 'Pulsa 5.000', 'TELKOMSEL-P5000', '5.000', 'Aktif +5 hari', 'Pengisian ke nomor kamu.', 6305, 6500, 'POPULER', 10, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-p10000', 'Pulsa 10.000', 'TELKOMSEL-P10000', '10.000', 'Aktif +15 hari', 'Pengisian ke nomor kamu.', 11155, 11500, null, 10, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-p25000', 'Pulsa 25.000', 'TELKOMSEL-P25000', '25.000', 'Aktif +30 hari', 'Pengisian ke nomor kamu.', 25705, 26500, 'POPULER', 10, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-p50000', 'Pulsa 50.000', 'TELKOMSEL-P50000', '50.000', 'Aktif +45 hari', 'Pengisian ke nomor kamu.', 49907, 51450, null, 10, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-p100000', 'Pulsa 100.000', 'TELKOMSEL-P100000', '100.000', 'Aktif +60 hari', 'Pengisian ke nomor kamu.', 98407, 101450, 'HEMAT', 10, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indosat-p10000', 'Pulsa 10.000', 'INDOSAT-P10000', '10.000', 'Aktif +15 hari', 'Masa aktif bertambah.', 11155, 11500, null, 8, 6, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indosat' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indosat-p25000', 'Pulsa 25.000', 'INDOSAT-P25000', '25.000', 'Aktif +30 hari', 'Masa aktif bertambah.', 25705, 26500, 'POPULER', 8, 7, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indosat' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indosat-p50000', 'Pulsa 50.000', 'INDOSAT-P50000', '50.000', 'Aktif +45 hari', 'Masa aktif bertambah.', 49907, 51450, null, 8, 8, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indosat' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'xl-p5000', 'Pulsa 5.000', 'XL-P5000', '5.000', 'Aktif +5 hari', 'Berlaku untuk semua kartu XL.', 6305, 6500, null, 6, 9, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'xl' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'xl-p25000', 'Pulsa 25.000', 'XL-P25000', '25.000', 'Aktif +30 hari', 'Berlaku untuk semua kartu XL.', 25705, 26500, 'POPULER', 6, 10, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'xl' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'xl-p100000', 'Pulsa 100.000', 'XL-P100000', '100.000', 'Aktif +60 hari', 'Berlaku untuk semua kartu XL.', 98407, 101450, 'HEMAT', 6, 11, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'xl' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'tri-p10000', 'Pulsa 10.000', 'TRI-P10000', '10.000', 'Aktif +15 hari', 'Cocok untuk isi ulang rutin.', 11155, 11500, null, 5, 12, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'tri' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'tri-p25000', 'Pulsa 25.000', 'TRI-P25000', '25.000', 'Aktif +30 hari', 'Cocok untuk isi ulang rutin.', 25705, 26500, 'POPULER', 5, 13, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'tri' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'smartfren-p25000', 'Pulsa 25.000', 'SMARTFREN-P25000', '25.000', 'Aktif +30 hari', 'Cocok untuk pemakaian harian.', 25705, 26500, 'POPULER', 4, 14, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'smartfren' where c.slug = 'pulsa'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'smartfren-p50000', 'Pulsa 50.000', 'SMARTFREN-P50000', '50.000', 'Aktif +45 hari', 'Cocok untuk pemakaian harian.', 49907, 51450, null, 4, 15, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'smartfren' where c.slug = 'pulsa'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-d1', 'Paket Data 1 GB', 'TELKOMSEL-D1', '1 GB', 'Berlaku 7 hari', 'Kuota utama 24 jam penuh.', 6305, 6500, 'POPULER', 9, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-d5', 'Paket Data 5 GB', 'TELKOMSEL-D5', '5 GB', 'Berlaku 30 hari', 'Kuota utama 24 jam penuh.', 25705, 26500, null, 9, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-d10', 'Paket Data 10 GB', 'TELKOMSEL-D10', '10 GB', 'Berlaku 30 hari', 'Kuota utama 24 jam penuh.', 47045, 48500, 'POPULER', 9, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'telkomsel-d25', 'Paket Data 25 GB', 'TELKOMSEL-D25', '25 GB', 'Berlaku 30 hari', 'Kuota utama 24 jam penuh.', 95545, 98500, null, 9, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'telkomsel' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'xl-d2', 'Paket Data 2 GB', 'XL-D2', '2 GB', 'Berlaku 14 hari', 'Kuota utama + kuota aplikasi.', 12125, 12500, 'HEMAT', 7, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'xl' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'xl-d10', 'Paket Data 10 GB', 'XL-D10', '10 GB', 'Berlaku 30 hari', 'Kuota utama + kuota aplikasi.', 47045, 48500, 'POPULER', 7, 6, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'xl' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'xl-d30', 'Paket Data 30 GB', 'XL-D30', '30 GB', 'Berlaku 30 hari', 'Kuota utama + kuota aplikasi.', 112035, 115500, 'HEMAT', 7, 7, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'xl' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indosat-d5', 'Paket Data 5 GB', 'INDOSAT-D5', '5 GB', 'Berlaku 30 hari', 'Reguler untuk semua jaringan.', 25705, 26500, null, 5, 8, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indosat' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indosat-d15', 'Paket Data 15 GB', 'INDOSAT-D15', '15 GB', 'Berlaku 30 hari', 'Reguler untuk semua jaringan.', 64505, 66500, null, 5, 9, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indosat' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'tri-d10', 'Paket Data 10 GB', 'TRI-D10', '10 GB', 'Berlaku 30 hari', 'Kuota AlwaysOn 24 jam.', 47045, 48500, 'POPULER', 4, 10, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'tri' where c.slug = 'data'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'tri-d30', 'Paket Data 30 GB', 'TRI-D30', '30 GB', 'Berlaku 30 hari', 'Kuota AlwaysOn 24 jam.', 112035, 115500, 'HEMAT', 4, 11, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'tri' where c.slug = 'data'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'dana-ew25', 'Saldo 25.000', 'DANA-EW25', '25.000', 'Masuk penuh', 'Top up saldo ke akun terdaftar.', 24735, 25500, 'POPULER', 9, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'dana' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'dana-ew50', 'Saldo 50.000', 'DANA-EW50', '50.000', 'Masuk penuh', 'Top up saldo ke akun terdaftar.', 48985, 50500, 'POPULER', 9, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'dana' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'dana-ew100', 'Saldo 100.000', 'DANA-EW100', '100.000', 'Masuk penuh', 'Top up saldo ke akun terdaftar.', 97485, 100500, null, 9, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'dana' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'gopay-ew50', 'Saldo 50.000', 'GOPAY-EW50', '50.000', 'Masuk penuh', 'Masuk penuh tanpa potongan.', 48985, 50500, 'POPULER', 7, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'gopay' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'gopay-ew100', 'Saldo 100.000', 'GOPAY-EW100', '100.000', 'Masuk penuh', 'Masuk penuh tanpa potongan.', 97485, 100500, null, 7, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'gopay' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'ovo-ew50', 'Saldo 50.000', 'OVO-EW50', '50.000', 'Masuk penuh', 'Top up saldo OVO.', 48985, 50500, 'POPULER', 5, 6, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'ovo' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'ovo-ew200', 'Saldo 200.000', 'OVO-EW200', '200.000', 'Masuk penuh', 'Top up saldo OVO.', 194485, 200500, 'HEMAT', 5, 7, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'ovo' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'shopeepay-ew100', 'Saldo 100.000', 'SHOPEEPAY-EW100', '100.000', 'Masuk penuh', 'Saldo untuk belanja & bayar.', 97485, 100500, null, 4, 8, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'shopeepay' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'linkaja-ew25', 'Saldo 25.000', 'LINKAJA-EW25', '25.000', 'Masuk penuh', 'Top up saldo LinkAja.', 24735, 25500, null, 3, 9, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'linkaja' where c.slug = 'ewallet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'linkaja-ew50', 'Saldo 50.000', 'LINKAJA-EW50', '50.000', 'Masuk penuh', 'Top up saldo LinkAja.', 48985, 50500, 'POPULER', 3, 10, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'linkaja' where c.slug = 'ewallet'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-prabayar-pln20', 'Token Listrik 20.000', 'PLN-PRABAYAR-PLN20', '20.000', '≈ 13,5 kWh', 'Token prabayar 20 digit.', 21825, 22500, 'POPULER', 10, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-prabayar' where c.slug = 'pln'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-prabayar-pln50', 'Token Listrik 50.000', 'PLN-PRABAYAR-PLN50', '50.000', '≈ 34,1 kWh', 'Token prabayar 20 digit.', 50925, 52500, null, 10, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-prabayar' where c.slug = 'pln'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-prabayar-pln100', 'Token Listrik 100.000', 'PLN-PRABAYAR-PLN100', '100.000', '≈ 69,2 kWh', 'Token prabayar 20 digit.', 99425, 102500, 'POPULER', 10, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-prabayar' where c.slug = 'pln'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-prabayar-pln200', 'Token Listrik 200.000', 'PLN-PRABAYAR-PLN200', '200.000', '≈ 138 kWh', 'Token prabayar 20 digit.', 196425, 202500, null, 10, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-prabayar' where c.slug = 'pln'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-prabayar-pln500', 'Token Listrik 500.000', 'PLN-PRABAYAR-PLN500', '500.000', '≈ 348 kWh', 'Token prabayar 20 digit.', 487425, 502500, 'HEMAT', 10, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-prabayar' where c.slug = 'pln'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-prabayar-pln1000', 'Token Listrik 1.000.000', 'PLN-PRABAYAR-PLN1000', '1.000.000', '≈ 698 kWh', 'Token prabayar 20 digit.', 972425, 1002500, null, 10, 6, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-prabayar' where c.slug = 'pln'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'pln-pascabayar-pln100', 'Token Listrik 100.000', 'PLN-PASCABAYAR-PLN100', '100.000', '≈ 69,2 kWh', 'Pembayaran tagihan listrik bulanan.', 99425, 102500, 'POPULER', 6, 7, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'pln-pascabayar' where c.slug = 'pln'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indihome-in1', 'Pembayaran Internet 1 Bulan', 'INDIHOME-IN1', '1 Bulan', 'Tagihan bulan berjalan', 'Tagihan IndiHome bulanan.', 363750, 375000, 'POPULER', 7, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indihome' where c.slug = 'internet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'indihome-in2', 'Pembayaran Internet 2 Bulan', 'INDIHOME-IN2', '2 Bulan', 'Dua periode akumulatif', 'Tagihan IndiHome bulanan.', 727500, 750000, null, 7, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'indihome' where c.slug = 'internet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'biznet-in1', 'Pembayaran Internet 1 Bulan', 'BIZNET-IN1', '1 Bulan', 'Tagihan bulan berjalan', 'Tagihan Biznet Home bulanan.', 339500, 350000, null, 6, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'biznet' where c.slug = 'internet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'firstmedia-in1', 'Pembayaran Internet 1 Bulan', 'FIRSTMEDIA-IN1', '1 Bulan', 'Tagihan bulan berjalan', 'Tagihan First Media bulanan.', 412250, 425000, null, 5, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'firstmedia' where c.slug = 'internet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'firstmedia-in2', 'Pembayaran Internet 2 Bulan', 'FIRSTMEDIA-IN2', '2 Bulan', 'Dua periode akumulatif', 'Tagihan First Media bulanan.', 824500, 850000, null, 5, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'firstmedia' where c.slug = 'internet'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'myrepublic-in1', 'Pembayaran Internet 1 Bulan', 'MYREPUBLIC-IN1', '1 Bulan', 'Tagihan bulan berjalan', 'Tagihan MyRepublic bulanan.', 310400, 320000, null, 4, 6, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'myrepublic' where c.slug = 'internet'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'bpjs-kesehatan-bp1', 'Iuran BPJS Iuran 1 Bulan', 'BPJS-KESEHATAN-BP1', 'Iuran 1 Bulan', 'Periode berjalan', 'Iuran BPJS Kesehatan per keluarga.', 145500, 150000, 'POPULER', 8, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'bpjs-kesehatan' where c.slug = 'bpjs'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'bpjs-kesehatan-bp2', 'Iuran BPJS Iuran 2 Bulan', 'BPJS-KESEHATAN-BP2', 'Iuran 2 Bulan', 'Dua periode akumulatif', 'Iuran BPJS Kesehatan per keluarga.', 291000, 300000, null, 8, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'bpjs-kesehatan' where c.slug = 'bpjs'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'bpjs-kesehatan-bp3', 'Iuran BPJS Iuran 3 Bulan', 'BPJS-KESEHATAN-BP3', 'Iuran 3 Bulan', 'Tiga periode akumulatif', 'Iuran BPJS Kesehatan per keluarga.', 436500, 450000, null, 8, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'bpjs-kesehatan' where c.slug = 'bpjs'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'fif-mf1', 'Angsuran 1 Angsuran', 'FIF-MF1', '1 Angsuran', 'Jatuh tempo berjalan', 'Angsuran FIF jatuh tempo.', 1212500, 1250000, 'POPULER', 6, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'fif' where c.slug = 'multifinance'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'fif-mf2', 'Angsuran 2 Angsuran', 'FIF-MF2', '2 Angsuran', 'Dua jatuh tempo', 'Angsuran FIF jatuh tempo.', 2425000, 2500000, null, 6, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'fif' where c.slug = 'multifinance'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'acc-mf1', 'Angsuran 1 Angsuran', 'ACC-MF1', '1 Angsuran', 'Jatuh tempo berjalan', 'Angsuran ACC jatuh tempo.', 1818750, 1875000, null, 5, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'acc' where c.slug = 'multifinance'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'mpm-mf1', 'Angsuran 1 Angsuran', 'MPM-MF1', '1 Angsuran', 'Jatuh tempo berjalan', 'Angsuran MPM Finance.', 921500, 950000, null, 4, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'mpm' where c.slug = 'multifinance'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'baf-mf1', 'Angsuran 1 Angsuran', 'BAF-MF1', '1 Angsuran', 'Jatuh tempo berjalan', 'Angsuran BAF jatuh tempo.', 1600500, 1650000, null, 4, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'baf' where c.slug = 'multifinance'
on conflict (slug) do nothing;

insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'aetra-pd1', 'Tagihan Air 1 Bulan', 'AETRA-PD1', '1 Bulan', 'Pemakaian bulan berjalan', 'Tagihan air Aetra bulanan.', 84875, 87500, 'POPULER', 5, 1, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'aetra' where c.slug = 'pdam'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'aetra-pd2', 'Tagihan Air 2 Bulan', 'AETRA-PD2', '2 Bulan', 'Dua periode akumulatif', 'Tagihan air Aetra bulanan.', 169750, 175000, null, 5, 2, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'aetra' where c.slug = 'pdam'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'palyja-pd1', 'Tagihan Air 1 Bulan', 'PALYJA-PD1', '1 Bulan', 'Pemakaian bulan berjalan', 'Tagihan air Palyja bulanan.', 84875, 87500, null, 5, 3, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'palyja' where c.slug = 'pdam'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'palyja-pd2', 'Tagihan Air 2 Bulan', 'PALYJA-PD2', '2 Bulan', 'Dua periode akumulatif', 'Tagihan air Palyja bulanan.', 169750, 175000, null, 5, 4, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'palyja' where c.slug = 'pdam'
on conflict (slug) do nothing;
insert into public.products (category_id, provider_id, slug, name, sku, nominal_label, nominal_note, description, cost_price, price, badge, popularity, sort_order, is_active)
select c.id, p.id, 'tirta-musi-pd1', 'Tagihan Air 1 Bulan', 'TIRTA-MUSI-PD1', '1 Bulan', 'Pemakaian bulan berjalan', 'Tagihan air Tirta Musi.', 84875, 87500, null, 3, 5, true
from public.categories c join public.providers p on p.category_id = c.id and p.slug = 'tirta-musi' where c.slug = 'pdam'
on conflict (slug) do nothing;

