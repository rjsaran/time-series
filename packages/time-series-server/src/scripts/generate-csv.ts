import * as fs from 'fs';
import moment from 'moment';

// Define sample data
const products = [
  'Laptop',
  'Headphones',
  'Smartphone',
  'Wireless Mouse',
  'LED Monitor',
  'Tablet',
  'Wireless Keyboard',
  'Notebook',
  'Gaming Console',
  'Smartwatch',
  'Office Chair',
  'Mechanical Keyboard',
  'Bluetooth Speaker',
  'Router',
];
const categories = [
  'Electronics',
  'Stationery',
  'Furniture',
  'Appliances',
  'Gaming',
  'Office Supplies',
];

// Possible date formats
const dateFormats = ['YYYY/MM/DD', 'MM-DD-YYYY', 'YYYY-MM-DD', ''];

const numRows = 10000; // Adjust the number of rows
const csvFile = 'large_data.csv';

// Generate random data
const startDate = moment('2024-02-01'); // February 1, 2024

const rows: string[] = [];

// Add CSV header
rows.push('date,product,amount,category');

// Generate CSV Data
for (let i = 0; i < numRows; i++) {
  // Generate a random date
  const randomDays = Math.floor(Math.random() * 60); // Within 2 months
  const dateValue = startDate.clone().add(randomDays, 'days');

  let dateStr = dateValue.format(
    dateFormats[Math.floor(Math.random() * dateFormats.length)]
  );

  // Generate product, amount, category
  const product = products[Math.floor(Math.random() * products.length)];
  const amount =
    Math.random() < 0.01
      ? `$${Math.floor(Math.random() * 5000)}`
      : `${Math.floor(Math.random() * 5000)}`;

  const category = categories[Math.floor(Math.random() * categories.length)];

  // Introduce random missing values
  if (Math.random() < 0.01) dateStr = ''; // 1% chance of missing date

  rows.push(`${dateStr},${product},${amount},${category}`);
}

// Write to CSV
fs.writeFileSync(csvFile, rows.join('\n'));

console.log(`✅ CSV file '${csvFile}' generated with ${numRows} rows!`);
