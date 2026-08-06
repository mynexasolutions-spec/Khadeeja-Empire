-- Optional: Seed measurements for demo products
-- Run this after the main seed.sql if you want sample measurements

UPDATE product_information
SET measurements = jsonb_build_object(
  'enabled', true,
  'unit', 'cm',
  'sizes', jsonb_build_array(
    jsonb_build_object(
      'size', 'XXS',
      'chest', '30-32',
      'waist', '24-26',
      'hip', '32-34'
    ),
    jsonb_build_object(
      'size', 'XS',
      'chest', '32-34',
      'waist', '26-28',
      'hip', '34-36'
    ),
    jsonb_build_object(
      'size', 'S',
      'chest', '34-36',
      'waist', '28-30',
      'hip', '36-38'
    ),
    jsonb_build_object(
      'size', 'M',
      'chest', '36-38',
      'waist', '30-32',
      'hip', '38-40'
    ),
    jsonb_build_object(
      'size', 'L',
      'chest', '38-40',
      'waist', '32-34',
      'hip', '40-42'
    ),
    jsonb_build_object(
      'size', 'XL',
      'chest', '40-42',
      'waist', '34-36',
      'hip', '42-44'
    )
  )
)
WHERE product_id IN (
  SELECT id FROM products  WHERE active = true LIMIT 6
);
