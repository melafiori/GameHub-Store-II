import { productos } from '../src/data/productos.js';

// Ejecutar con acceso local a los servicios; no elimina ni actualiza registros existentes.
const categoryUrl = process.env.CATEGORY_URL || 'http://localhost:8002';
const productUrl = process.env.PRODUCT_URL || 'http://localhost:8007';
const inventoryUrl = process.env.INVENTORY_URL || 'http://localhost:8003';
const adminToken = process.env.CATALOG_ADMIN_TOKEN;
if (!adminToken) throw new Error('Configure CATALOG_ADMIN_TOKEN con un JWT de administrador');

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${url}: HTTP ${response.status}`);
  return response.json();
}
const post = (url, body) => request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify(body) });

const categories = await request(`${categoryUrl}/api/v1/categories`);
const existingProducts = await request(`${productUrl}/api/v1/products`);
const byCategory = new Map(categories.map(category => [category.nombre, category.categoryId]));
const bySku = new Map(existingProducts.map(product => [product.sku, product.id]));
let createdCategories = 0, createdProducts = 0, createdInventory = 0;

for (const product of productos) {
  let categoryId = byCategory.get(product.categoria);
  if (!categoryId) {
    const category = await post(`${categoryUrl}/api/v1/categories`, { nombre: product.categoria, descripcion: product.categoria, estado: 'ACTIVO' });
    categoryId = category.categoryId;
    byCategory.set(product.categoria, categoryId);
    createdCategories++;
  }
  const sku = `GH-ORIGINAL-${String(product.id).padStart(4, '0')}`;
  let productId = bySku.get(sku);
  if (!productId) {
    const created = await post(`${productUrl}/api/v1/products`, {
      sku, nombre: product.nombre, marca: product.marca, modelo: product.nombre,
      precio: product.precio, categoryId, descripcion: product.descripcion, estado: 'ACTIVO',
      imagen: product.imagen, especificaciones: JSON.stringify(product.especificaciones || {}),
    });
    productId = created.productId;
    bySku.set(sku, productId);
    createdProducts++;
  }
  const existing = await fetch(`${inventoryUrl}/api/v1/inventory/product/${productId}`);
  if (existing.status === 404) {
    await post(`${inventoryUrl}/api/v1/inventory`, { productId, stockDisponible: product.stock, stockReservado: 0, stockMinimo: 0, ubicacion: 'Carga inicial' });
    createdInventory++;
  } else if (!existing.ok) {
    throw new Error(`GET inventario producto ${productId}: HTTP ${existing.status}`);
  }
}
console.log(`Carga terminada: ${createdCategories} categorías, ${createdProducts} productos y ${createdInventory} inventarios nuevos.`);
