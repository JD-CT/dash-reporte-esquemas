
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

// Function to run Python script and get processed data
function processExcelData(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'process_excel.py');
    const python = spawn('python3', [pythonScript]);
    
    let data = '';
    let errorData = '';
    
    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });
    
    python.stderr.on('data', (chunk) => {
      errorData += chunk.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorData);
        reject(new Error(`Python script failed with code ${code}`));
        return;
      }
      
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (err) {
        console.error('Failed to parse JSON:', err);
        reject(err);
      }
    });
  });
}

async function main() {
  console.log('🌱 Starting seed process...');
  
  try {
    // Delete existing records
    console.log('🗑️  Clearing existing records...');
    await prisma.cumplimientoRecord.deleteMany();
    
    // Process Excel data
    console.log('📊 Processing Excel data...');
    const processedData = await processExcelData();
    
    console.log(`📥 Found ${processedData.length} non-compliance records to import`);
    
    // Insert processed data
    console.log('💾 Importing data to database...');
    const batchSize = 100;
    
    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      await prisma.cumplimientoRecord.createMany({
        data: batch
      });
      console.log(`   ✅ Imported batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(processedData.length/batchSize)}`);
    }
    
    // Verify import
    const totalRecords = await prisma.cumplimientoRecord.count();
    console.log(`✨ Successfully imported ${totalRecords} records!`);
    
    // Show summary stats
    const dirisCount = await prisma.cumplimientoRecord.groupBy({
      by: ['dd_nombre'],
      _count: true
    });
    
    console.log('\n📈 Summary by DIRIS:');
    dirisCount
      .sort((a, b) => b._count - a._count)
      .slice(0, 10)
      .forEach(item => {
        console.log(`   ${item.dd_nombre}: ${item._count} cases`);
      });
      
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
