const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:8080/api/categorias';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const categoriasFalsas = [
    { nombre: 'Bebidas', descripcion: 'Todo tipo de bebidas frías y gasificadas', activa: true },
    { nombre: 'Almacén', descripcion: 'Productos de despensa y no perecederos', activa: true },
    { nombre: 'Lácteos', descripcion: 'Leches, yogures y quesos', activa: true },
    { nombre: 'Limpieza', descripcion: 'Productos de aseo personal y del hogar', activa: true },
    { nombre: 'Perfumería', descripcion: 'Cuidado personal y belleza', activa: true },
    { nombre: 'Congelados', descripcion: 'Alimentos súper congelados', activa: true },
    { nombre: 'Fiambres', descripcion: 'Fiambres y embutidos', activa: true },
    { nombre: 'Panadería', descripcion: 'Panes y facturas', activa: true }
];

async function seedCategories(token) {
    console.log(`\nIniciando la carga de ${categoriasFalsas.length} categorías...`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
    };

    let successCount = 0;
    let errorCount = 0;

    for (const cat of categoriasFalsas) {
        try {
            const response = await axios.post(API_URL, cat, { headers });
            console.log(`✅ Creada: ${cat.nombre}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error al crear: ${cat.nombre}`);
            if (error.response) {
                console.error(`   Detalle: ${error.response.status} -`, JSON.stringify(error.response.data));
            } else {
                console.error(`   Error:`, error.message);
            }
            errorCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay corto
    }

    console.log('\n--- Resumen Categorías ---');
    console.log(`Exitosos: ${successCount}`);
    console.log(`Fallidos: ${errorCount}`);
}

rl.question('🔑 Por favor, pega tu TOKEN (ej. eyJhb...): ', async (token) => {
    if (!token) {
        console.log("❌ Debes proveer un token para continuar.");
        rl.close();
        return;
    }
    await seedCategories(token);
    rl.close();
});
