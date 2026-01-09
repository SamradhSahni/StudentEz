const fs = require("fs");
const pdfParse = require("pdf-parse");

const expectedKeywords = [
  "JavaScript", "Node.js", "Express", "MongoDB", "React", "API",
  "REST", "Git", "HTML", "CSS", "SQL", "Agile", "TypeScript", "OOP", "Data Structures"
];

const actionVerbs = [
  "built", "developed", "created", "designed", "led", "managed", "implemented", "collaborated"
];

const buzzwords = [
  "hardworking", "team player", "go-getter", "synergy", "enthusiastic"
];

const importantSections = [
  "experience", "education", "skills", "projects", "certifications"
];

exports.analyzeResume = async (filePath, originalName) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text.toLowerCase();
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
  const wordCount = text.split(/\s+/).length;
  const pageCount = pdfData.numpages;

  const foundKeywords = expectedKeywords.filter(kw => text.includes(kw.toLowerCase()));
  const foundActions = actionVerbs.filter(verb => text.includes(verb));
  const foundBuzz = buzzwords.filter(word => text.includes(word));
  const missingSections = importantSections.filter(section => !text.includes(section));

  // Subscores
  const keywordScore = Math.round((foundKeywords.length / expectedKeywords.length) * 100);
  const actionScore = Math.round((foundActions.length / actionVerbs.length) * 100);
  const formattingScore = pageCount > 2 ? 50 : 100;
  const lengthScore = wordCount >= 250 && wordCount <= 750 ? 100 : 60;

  const totalScore = Math.round((keywordScore * 0.4) + (actionScore * 0.2) + (formattingScore * 0.2) + (lengthScore * 0.2));

  // Score level
  let scoreLevel = "";
  if (totalScore >= 90) scoreLevel = "🟢 Very Strong";
  else if (totalScore >= 80) scoreLevel = "🟡 Strong";
  else if (totalScore >= 70) scoreLevel = "🟠 Average";
  else scoreLevel = "🔴 Needs Improvement";

  // Suggestions
  const suggestions = [];

  if (foundKeywords.length < expectedKeywords.length) {
    suggestions.push("Missing key technical keywords: " + expectedKeywords.filter(k => !text.includes(k.toLowerCase())).join(", "));
  }

  if (missingSections.length) {
    suggestions.push("Missing important sections: " + missingSections.join(", "));
  }

  if (foundActions.length < 4) {
    suggestions.push("Add more strong action verbs like built, managed, created, collaborated.");
  }

  if (pageCount > 2) suggestions.push("Keep resume within 1-2 pages for better readability.");
  if (wordCount < 250) suggestions.push("Resume is too short — add more content.");
  else if (wordCount > 800) suggestions.push("Resume is too long — try trimming it down.");

  if (foundBuzz.length > 2) suggestions.push("Avoid overusing buzzwords like 'hardworking' and 'team player'.");

  if (originalName.toLowerCase() === "resume.pdf") {
    suggestions.push("Rename your resume file to include your name (e.g., Samradh_Sahni_Resume.pdf).");
  }

  // if (!text.match(/(?:\+?\d{2,3}[-.\s]?)?(?:\d{10})/)) {
  //   suggestions.push("Phone number not detected. Add a contact number.");
  // }

  if (!text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
    suggestions.push("Email address not detected. Add your email.");
  }

  if (!lines.some(line => line.startsWith("•") || line.startsWith("-"))) {
    suggestions.push("Use bullet points to highlight achievements.");
  }

  return {
    score: totalScore,
    scoreLevel,
    suggestions,
    details: {
      keywordScore,
      actionScore,
      formattingScore,
      lengthScore,
      wordCount,
      pageCount
    }
  };
};
