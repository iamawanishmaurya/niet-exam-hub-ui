const fs = require('fs');
const path = require('path');

const mappingPath = '/home/astra/niet_exam_hub2/nietexamhub-main/src/data/ppt_asset_mapping.json';
const dataRepoPath = '/home/astra/niet_exam_hub2/nietexamhub-main/tmp-ppt-data-repo';

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

const data = {};
const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

semesters.forEach(sem => {
    data[sem] = [];
});

let totalPpts = 0;

Object.keys(mapping).forEach(subjectCode => {
    mapping[subjectCode].forEach(paper => {
        const sem = paper.semester || "I";
        if (data[sem]) {
            // path is like "/pptx/Ppt/Semester I/Sub/Unit 5.pdf"
            // File relative to semester folder:
            const parts = paper.path.split('/');
            // parts = ["", "pptx", "Ppt", "Semester I", "Sub", "Unit 5.pdf"]
            // From index 4 onwards: ["Sub", "Unit 5.pdf"]
            const relativeParts = parts.slice(4).map(p => encodeURIComponent(p));
            const semLink = './' + relativeParts.join('/');

            data[sem].push({
                subject: paper.subject_name.trim(),
                link: semLink,
                filename: paper.filename,
                teacher: paper.teacher_name || 'Unknown'
            });
            totalPpts++;
        }
    });
});

let readmeContent = `# NIET PPT Data\n\n`;
readmeContent += `This repository contains all the PPT presentations and study materials for NIET Exam Hub.\n\n`;
readmeContent += `## Browse PPTs (Total: ${totalPpts})\n\n`;

// Total summary
readmeContent += `| Semester | PPTs Available | Link |\n`;
readmeContent += `| :--- | :--- | :--- |\n`;
semesters.forEach(sem => {
    if (data[sem] && data[sem].length > 0) {
        readmeContent += `| Semester ${sem} | ${data[sem].length} | [View Semester ${sem}](./Semester%20${sem}/README.md) |\n`;
    }
});
readmeContent += `\n`;

// Write the main README
fs.writeFileSync(path.join(dataRepoPath, 'README.md'), readmeContent);
console.log('✅ Generated root README.md with stats');

// Detailed breakdowns per semester
semesters.forEach(sem => {
    const papers = data[sem];
    if (papers && papers.length > 0) {
        papers.sort((a, b) => a.subject.localeCompare(b.subject));

        let semReadmeContent = `# Semester ${sem} PPTs\n\n`;
        semReadmeContent += `[Back to main README](../README.md)\n\n`;
        semReadmeContent += `| Subject | File | Contributor |\n`;
        semReadmeContent += `| :--- | :--- | :--- |\n`;

        papers.forEach(p => {
            semReadmeContent += `| ${p.subject} | [${p.filename}](${p.link}) | ${p.teacher} |\n`;
        });
        semReadmeContent += `\n`;

        const semDir = path.join(dataRepoPath, `Semester ${sem}`);
        if (fs.existsSync(semDir)) {
            fs.writeFileSync(path.join(semDir, 'README.md'), semReadmeContent);
            console.log(`✅ Generated README.md for Semester ${sem}`);
        }
    }
});
