const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:8080/api/productos';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateCode = () => `PROD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const categories = [
    { id: 1, name: 'Bebidas' },
    { id: 2, name: 'Almacén' },
    { id: 3, name: 'Lácteos' },
    { id: 4, name: 'Limpieza' },
    { id: 5, name: 'Perfumería' }
];

const brands = ['Coca Cola', 'Pepsi', 'Danone', 'Molinos', 'Arcor'];
const productTypes = ['Agua', 'Gaseosa', 'Arroz', 'Fideos', 'Galletitas'];

async function seedProducts(token) {
    const mockProducts = Array.from({ length: 100 }, (_, i) => {
        const type = productTypes[Math.floor(Math.random() * productTypes.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const precioCompra = Math.floor(Math.random() * 4500) + 500;
        const precioVenta = Math.round(precioCompra * 1.5);
    
        return {
            nombre: `${type} ${brand} Variedad ${i + 1}`,
            codigo: generateCode(),
            proveedor: brand,
            precioCompra: precioCompra,
            precioVenta: precioVenta,
            categoria: { categoriaId: cat.id },
            stock: Math.floor(Math.random() * 100) + 1,
            disponible: true,
            descripcion: `Producto de la categoría ${cat.name}`
        };
    });

    console.log(`\nIniciando la carga de ${mockProducts.length} productos...`);

    const headers = { 'Authorization': `Bearer ${token.trim()}` };
    let successCount = 0;
    let errorCount = 0;

    for (const product of mockProducts) {
        try {
            await axios.post(API_URL, product, { headers });
            console.log(`✅ Creado: ${product.nombre}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error al crear: ${product.nombre}`);
            errorCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\nExitosos: ${successCount} | Fallidos: ${errorCount}`);
}

rl.question('🔑 Por favor, pega tu TOKEN JWT: ', async (token) => {
    if (!token) return rl.close();
    await seedProducts(token);
    rl.close();
});
