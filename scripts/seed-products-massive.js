const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:8080/api/productos';

const args = process.argv.slice(2);
const LIMITE_PRODUCTOS = args.length > 0 && !isNaN(parseInt(args[0])) ? parseInt(args[0]) : 10000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateCode = () => `PROD-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}-${Date.now().toString().slice(-4)}`;

const categories = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
const brands = ['Coca Cola', 'Pepsi', 'Danone', 'Molinos', 'Arcor'];
const productTypes = ['Agua', 'Gaseosa', 'Arroz', 'Fideos', 'Galletitas'];

function generateBatch(size, startIndex) {
    const batch = [];
    for (let i = 0; i < size; i++) {
        const type = productTypes[Math.floor(Math.random() * productTypes.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const precioCompra = Math.floor(Math.random() * 4500) + 500;

        batch.push({
            nombre: `${type} ${brand} Especial ${startIndex + i + 1}`,
            codigo: generateCode(),
            proveedor: brand,
            precioCompra: precioCompra,
            precioVenta: Math.round(precioCompra * 1.5),
            categoria: { categoriaId: cat.id },
            stock: 100,
            disponible: true,
            descripcion: `Producto masivo tipo ${type}`
        });
    }
    return batch;
}

async function seedProductsMassive(token) {
    console.log(`\n🚀 INICIANDO CARGA MASIVA: ${LIMITE_PRODUCTOS} productos...`);
    
    const headers = { 'Authorization': `Bearer ${token.trim()}` };
    let successCount = 0;
    let errorCount = 0;
    const CONCURRENCY_LIMIT = 50; 
    
    for (let i = 0; i < LIMITE_PRODUCTOS; i += CONCURRENCY_LIMIT) {
        const currentBatchSize = Math.min(CONCURRENCY_LIMIT, LIMITE_PRODUCTOS - i);
        const batchProducts = generateBatch(currentBatchSize, i);
        
        const requests = batchProducts.map(product => 
            axios.post(API_URL, product, { headers })
                .then(() => { successCount++; return { success: true }; })
                .catch(() => { errorCount++; return { success: false }; })
        );

        await Promise.all(requests);
        
        const progress = Math.round(((i + currentBatchSize) / LIMITE_PRODUCTOS) * 100);
        process.stdout.write(`\r[${progress}%] Progreso: ${successCount} exitosos, ${errorCount} fallidos...`);
        await new Promise(resolve => setTimeout(resolve, 100)); 
    }

    console.log('\n\n✅ --- RESUMEN FINAL ---');
    console.log(`📊 Solicitados: ${LIMITE_PRODUCTOS} | 🟢 Exitosos: ${successCount} | 🔴 Fallidos: ${errorCount}`);
}

// Pregunta por Token y arranca
rl.question(`Se van a generar ${LIMITE_PRODUCTOS} productos. \n🔑 Pega tu TOKEN JWT y presiona enter: `, async (token) => {
    if (!token) return rl.close();
    await seedProductsMassive(token);
    rl.close();
});
