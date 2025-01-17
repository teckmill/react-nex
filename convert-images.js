const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertSvgToPng = async (inputPath, outputPath, width, height) => {
  try {
    const svg = fs.readFileSync(inputPath, 'utf8');
    await sharp(Buffer.from(svg))
      .resize(width, height)
      .png()
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

const main = async () => {
  const assetsDir = path.join(__dirname, 'assets');

  // Convert icon
  await convertSvgToPng(
    path.join(assetsDir, 'icon.svg'),
    path.join(assetsDir, 'icon.png'),
    1024,
    1024
  );

  // Convert adaptive icon
  await convertSvgToPng(
    path.join(assetsDir, 'adaptive-icon.svg'),
    path.join(assetsDir, 'adaptive-icon.png'),
    1024,
    1024
  );

  // Convert splash
  await convertSvgToPng(
    path.join(assetsDir, 'splash.svg'),
    path.join(assetsDir, 'splash.png'),
    1242,
    2436
  );

  // Create favicon (smaller version of icon)
  await convertSvgToPng(
    path.join(assetsDir, 'icon.svg'),
    path.join(assetsDir, 'favicon.png'),
    32,
    32
  );
};

main().catch(console.error);
