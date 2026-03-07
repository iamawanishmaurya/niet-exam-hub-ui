(async () => {
   try {
     console.log('Importing extracted_data...');
     await import('./assets/extracted_data-v6.js');
     console.log('Importing ppt_data...');
     await import('./assets/ppt_data-v6.js');
     console.log('Importing asset_mapping...');
     await import('./assets/asset_mapping-v6.js');
     console.log('Importing ppt_asset_mapping...');
     await import('./assets/ppt_asset_mapping-v6.js');
     console.log('All imports succeeded!');
   } catch (e) {
     console.error('IMPORT ERROR:', e);
   }
})();
