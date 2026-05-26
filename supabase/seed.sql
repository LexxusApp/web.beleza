-- Seed de categorias e produtos iniciais do Lumière

insert into public.categories (name, slug, description, sort_order) values
  ('Maquiagem',  'maquiagem',  'Batons, bases, blushes e tudo para um look impecável.', 1),
  ('Skincare',   'skincare',   'Séruns, cremes e tratamentos de alta performance.',     2),
  ('Perfumaria', 'perfumaria', 'Fragrâncias assinatura das maisons mais prestigiadas.', 3)
on conflict (slug) do nothing;

with cat as (
  select id, slug from public.categories
)
insert into public.products
  (slug, brand, name, description, price, image_url, category_id, how_to_use, ingredients, stock, featured, active)
values
  ('rouge-velours-chanel', 'CHANEL', 'Rouge Allure Velours — Tom 58',
   'Batom matte aveludado de longa duração com pigmentação intensa.',
   389.90, '/products/chanel-lipstick.jpg',
   (select id from cat where slug = 'maquiagem'),
   'Aplique diretamente nos lábios ou com pincel para maior precisão.',
   'Dimethicone, Isododecane, Trisiloxane, Cera Alba, Tocopherol.',
   25, true, true),
  ('serum-advanced-night-estee', 'ESTÉE LAUDER', 'Advanced Night Repair Serum',
   'Sérum de tratamento noturno que reduz sinais visíveis do envelhecimento.',
   649.00, '/products/estee-serum.jpg',
   (select id from cat where slug = 'skincare'),
   'Aplique 3 a 5 gotas no rosto limpo, de manhã e à noite.',
   'Aqua, Bifida Ferment Lysate, Tripeptide-32, Hyaluronic Acid.',
   18, true, true),
  ('black-opium-yves', 'YVES SAINT LAURENT', 'Black Opium Eau de Parfum 90ml',
   'Fragrância oriental gourmand com notas de café e baunilha.',
   789.00, '/products/ysl-perfume.jpg',
   (select id from cat where slug = 'perfumaria'),
   'Borrife a 20 cm da pele nos pontos de pulsação.',
   'Alcohol Denat., Parfum, Aqua, Benzyl Salicylate, Linalool.',
   12, true, true),
  ('forever-skin-glow-dior', 'DIOR', 'Forever Skin Glow Foundation',
   'Base de alta cobertura com acabamento luminoso e FPS 15.',
   459.00, '/products/dior-foundation.jpg',
   (select id from cat where slug = 'maquiagem'),
   'Aplique uma bomba no centro do rosto e espalhe com esponja úmida.',
   'Aqua, Cyclopentasiloxane, Glycerin, Niacinamide.',
   30, false, true),
  ('la-mer-creme', 'LA MER', 'Crème de la Mer Moisturizing Cream',
   'Creme hidratante regenerador com o lendário Miracle Broth.',
   1890.00, '/products/lamer-cream.jpg',
   (select id from cat where slug = 'skincare'),
   'Aqueça uma pequena quantidade entre as pontas dos dedos.',
   'Algae Extract, Petrolatum, Glycerin, Lime Tea Concentrate.',
   8, true, true),
  ('nars-orgasm-blush', 'NARS', 'Blush Orgasm — Edição Iconic',
   'Blush em pó com partículas douradas, tom pêssego universal.',
   279.00, '/products/nars-blush.jpg',
   (select id from cat where slug = 'maquiagem'),
   'Aplique nas maçãs do rosto com pincel chanfrado.',
   'Mica, Talc, Titanium Dioxide, Iron Oxides.',
   40, false, true),
  ('charlotte-tilbury-pillow', 'CHARLOTTE TILBURY', 'Pillow Talk Lip Cheat Liner',
   'Lápis labial de longa duração que define e prolonga o batom.',
   219.00, '/products/charlotte-lip.jpg',
   (select id from cat where slug = 'maquiagem'),
   'Contorne os lábios seguindo o formato natural.',
   'Cyclopentasiloxane, Synthetic Wax, Iron Oxides.',
   50, false, true),
  ('tom-ford-ombre-leather', 'TOM FORD', 'Ombré Leather Parfum 50ml',
   'Fragrância amadeirada com acordes de couro e jasmim.',
   1290.00, '/products/tomford-perfume.jpg',
   (select id from cat where slug = 'perfumaria'),
   'Duas borrifadas no peito e uma no pulso.',
   'Alcohol Denat., Parfum, Leather Accord, Jasmine Sambac.',
   10, true, true)
on conflict (slug) do nothing;

with p as (
  select id, slug from public.products
)
insert into public.reviews (product_id, author, rating, comment) values
  ((select id from p where slug = 'rouge-velours-chanel'), 'Marina S.', 5,
   'Textura aveludada impecável. Dura o dia inteiro sem ressecar.'),
  ((select id from p where slug = 'rouge-velours-chanel'), 'Camila R.', 4,
   'Cor intensa e sofisticada. Embalagem digna de luxo.'),
  ((select id from p where slug = 'serum-advanced-night-estee'), 'Juliana M.', 5,
   'Minha pele ficou visivelmente mais luminosa em duas semanas.'),
  ((select id from p where slug = 'black-opium-yves'), 'Fernanda L.', 5,
   'Fixação excelente. Notas doces com fundo amadeirado — viciante.'),
  ((select id from p where slug = 'la-mer-creme'), 'Patrícia H.', 5,
   'Investimento que vale cada centavo. Pele macia e regenerada.'),
  ((select id from p where slug = 'tom-ford-ombre-leather'), 'Ricardo M.', 5,
   'Couro sofisticado sem ser agressivo. Assinatura olfativa marcante.')
on conflict do nothing;
