import { useEffect, useState } from 'react';

const gateway = import.meta.env.VITE_API_URL || 'http://localhost:8014';

async function leer(ruta, signal) {
  const respuesta = await fetch(`${gateway}${ruta}`, { signal });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return respuesta.json();
}

function especificaciones(valor) {
  if (!valor) return {};
  try { return typeof valor === 'string' ? JSON.parse(valor) : valor; } catch { return {}; }
}

export function useCatalogo() {
  const [estado, setEstado] = useState({ productos: [], categorias: [], cargando: true, error: false });

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      leer('/api/v1/products', controller.signal),
      leer('/api/v1/categories', controller.signal),
    ]).then(([productos, categorias]) => {
      if (!Array.isArray(productos) || !Array.isArray(categorias)) throw new Error('Respuesta inválida');
      setEstado({
        productos: productos.filter(p => p.estado?.toUpperCase() === 'ACTIVO').map(p => ({
          id: p.id,
          sku: p.sku,
          nombre: p.nombre,
          marca: p.marca || '',
          precioNormal: Number(p.precio),
          precio: Number(p.precioVigente ?? p.precio),
          descripcion: p.descripcion,
          categoria: p.categoria?.nombre || 'Sin categoría',
          imagen: p.imagen || '', especificaciones: especificaciones(p.especificaciones),
          stock: p.stock ?? null,
          estado: p.stock == null ? 'Disponibilidad no informada' : p.stock <= 0 ? 'Sin stock' : `${p.stock} unidades disponibles`,
        })),
        categorias: categorias.filter(c => c.estado?.toUpperCase() === 'ACTIVO'),
        cargando: false,
        error: false,
      });
    }).catch(error => {
      if (error.name !== 'AbortError') setEstado({ productos: [], categorias: [], cargando: false, error: true });
    });
    return () => controller.abort();
  }, []);

  return estado;
}
