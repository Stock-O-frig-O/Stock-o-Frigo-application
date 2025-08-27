-- ajout des catégories
INSERT INTO category (id, name) VALUES (1, 'Fruits'), (2, 'Légumes'), (3, 'Produits laitiers'), (4, 'Viandes'), (5, 'Céréales'), (6, 'Épices'), (7, 'Condiments'), (8, 'Produits de boulangerie');

-- ajout des unités
INSERT INTO unit (id, unit) VALUES (1, 'kg'), (2, 'g'), (3, 'l'), (4, 'ml'), (5, 'pièce'), (6, 'CàC'), (7, 'CàS'), (8, 'pincée');

INSERT INTO product (id, name, brand, barcode, image_url, unit_id, is_ingredient, created_at, updated_at, category_id) VALUES
(1, 'Pomme', 'Brand A', '1234567890123', 'http://example.com/image1.jpg', 1, true, NOW(), NOW(), 1),
(2, 'Carotte', 'Brand B', '1234567890124', 'http://example.com/image2.jpg', 2, true, NOW(), NOW(), 2),
(3, 'Lait', 'Brand C', '1234567890125', 'http://example.com/image3.jpg', 3, true, NOW(), NOW(), 3),
(4, 'Poulet', 'Brand D', '1234567890126', 'http://example.com/image4.jpg', 1, true, NOW(), NOW(), 4),
(5, 'Riz', 'Brand E', '1234567890127', 'http://example.com/image5.jpg', 1, true, NOW(), NOW(), 5),
(6, 'Cumin', 'Brand F', '1234567890128', 'http://example.com/image6.jpg', 2, true, NOW(), NOW(), 6),
(7, 'Basilic', 'Brand G', '1234567890129', 'http://example.com/image7.jpg', 2, true, NOW(), NOW(), 7),
(8, 'Thym', 'Brand H', '1234567890130', 'http://example.com/image8.jpg', 2, true, NOW(), NOW(), 7),
(9, 'Ail', 'Brand I', '1234567890131', 'http://example.com/image9.jpg', 5, true, NOW(), NOW(), 2),
(10, 'Oignon', 'Brand J', '1234567890132', 'http://example.com/image10.jpg', 5, true, NOW(), NOW(), 2),
(11, 'Piment', 'Brand K', '1234567890133', 'http://example.com/image11.jpg', 5, true, NOW(), NOW(), 2),
(12, 'Coriandre', 'Brand L', '1234567890134', 'http://example.com/image12.jpg', 6, true, NOW(), NOW(), 7),
(13, 'Paprika', 'Brand M', '1234567890135', 'http://example.com/image13.jpg', 6, true, NOW(), NOW(), 6);