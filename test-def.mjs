(async () => {
   try {
     const t = await import('./assets/extracted_data-v6.js');
     const s = await import('./assets/asset_mapping-v6.js');
     console.log('s.default keys length:', Object.keys(s.default).length);
     console.log('t.default keys length:', Object.keys(t.default).length);
     
     // Let's run the actual mapping logic from useExamPapers
     const e = t.default;
     const s_def = s.default;
     
     const mapped = e.map(item => {
        const a=item.subject_code;
        // pe function logic
        let r=0; // semester
        // n function logic
        
        let n = null;
        if (s_def[a]) {
          n = s_def[a];
        } else {
          const stripped = a.replace(/[A-Z]$/,"");
          if (stripped !== a && s_def[stripped]) {
             n = s_def[stripped];
          }
        }
        return {code: a, arr: n};
     });
     console.log('Mapped output sample:', mapped.slice(0, 2));
   } catch(e) {
     console.error('ERROR IN MAPPING:', e);
   }
})();
