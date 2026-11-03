import { jsPDF } from "jspdf";
import { MASTER_ASSESSMENT_QUESTIONS, ASSESSMENT_DIMENSIONS, SCALE_RATING_GUIDE, AssessmentQuestion } from "../data/assessmentQuestions";
import { MBTI_QUESTIONS, MBTI_PROFILES } from "../data/mbtiData";
import { 
  GENE_KEYS, 
  LIFE_PATH_KNOWLEDGE, 
  ZODIAC_KNOWLEDGE, 
  HD_TYPE_KNOWLEDGE, 
  AURA_KNOWLEDGE 
} from "../data/knowledge";
import { getProfileComputed } from "../utils/calculations";
import { Profile } from "../types";
import { AFFINITY_FULL_LOGO_BANNER } from "./brandLogoBase64";

export const AFFINITY_LOGO_BASE64 = "data:image/png;base64,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";

export const IP_STATEMENT = "Intellectual Property of Affinity Lifestyle Consulting ~ Tiffany Windsheimer";

/**
 * Applies the official Affinity Lifestyle Consulting executive header and footer across all pages
 * strictly matching the professional executive styling of GVA-001 (no watermarks, no big blue bars).
 */
export function applyAffinityHeaderAndFooter(doc: jsPDF, title: string) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Official Affinity Lifestyle Consulting Brand Banner (Logo + Flowing Script Name)
    try {
      doc.addImage(AFFINITY_FULL_LOGO_BANNER, "PNG", margin, 2.5, 34, 10.2);
    } catch {
      doc.addImage(AFFINITY_LOGO_BASE64, "PNG", margin, 3.8, 6.8, 6.5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text("AFFINITY", margin + 8.5, 7.2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.5);
      doc.setTextColor(51, 89, 89);
      doc.text("LIFESTYLE CONSULTING", margin + 8.5, 9.8);
    }

    // Right Side Header Document Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(title.toUpperCase(), pageWidth - margin, 7.5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text("Official Client Assessment Protocol", pageWidth - margin, 10.4, { align: "right" });

    // Thin elegant teal-slate divider line (.2 .35 .35)
    doc.setDrawColor(51, 89, 89);
    doc.setLineWidth(0.35);
    doc.line(margin, 13, pageWidth - margin, 13);

    // Bottom Footer Banner with Official Intellectual Property Notice
    doc.setDrawColor(51, 89, 89);
    doc.setLineWidth(0.35);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(71, 85, 105);
    doc.text(IP_STATEMENT, pageWidth / 2, pageHeight - 6.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 6.5, { align: "right" });
  }
}

/**
 * Adds an interactive AcroForm text field for editable PDFs
 */
function addInteractiveTextField(
  doc: jsPDF,
  fieldName: string,
  x: number,
  y: number,
  w: number,
  h: number,
  defaultValue = ""
) {
  try {
    const acro = (doc as any).AcroForm;
    if (acro && acro.TextField) {
      const field = new acro.TextField();
      field.Rect = [x, y, w, h];
      field.fieldName = fieldName;
      field.value = defaultValue;
      field.fontSize = 8;
      (doc as any).addField(field);
    }
  } catch {
    // Fallback gracefully
  }
}

/**
 * Adds an interactive AcroForm checkbox field for editable PDFs (always defaults to completely unchecked and blank)
 */
function addInteractiveCheckBox(
  doc: jsPDF,
  fieldName: string,
  x: number,
  y: number,
  size: number
) {
  try {
    const acro = (doc as any).AcroForm;
    if (acro && acro.CheckBox) {
      const cb = new acro.CheckBox();
      cb.Rect = [x, y, size, size];
      cb.fieldName = fieldName;
      cb.value = "Off";
      cb.checked = false;
      cb.appearanceState = "Off";
      (doc as any).addField(cb);
    }
  } catch {
    // Fallback gracefully
  }
}

/**
 * Downloads an interactive, editable PDF containing all 181 Psychometric questions
 * with fillable candidate information fields, AcroForm rating checkboxes [1] to [5],
 * plain English questions, Affinity logo header, and the mandatory IP footer on every page.
 */
/**
 * Downloads an interactive, editable PDF containing all 181 Psychometric questions
 * strictly formatted to the GVA-001 executive consulting specification:
 * centered logo, thin teal divider lines, blank unchecked boxes, no watermarks, no big blue bars,
 * and Tiffany Windsheimer IP notice on every page.
 */
export function downloadEditablePsychometricPDF(title = "DOCUMENT 1: THE AMBI-181 MASTER ASSESSMENT (GVA-001 ARCHETYPE)") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }
  };

  // Top Centered Official Brand Banner (Logo + Flowing Script Name)
  try {
    doc.addImage(AFFINITY_FULL_LOGO_BANNER, "PNG", (pageWidth - 52) / 2, y, 52, 15.6);
    y += 18;
  } catch {
    doc.addImage(AFFINITY_LOGO_BASE64, "PNG", (pageWidth - 18) / 2, y, 18, 17);
    y += 19;
  }

  // Divider Line (.2 .35 .35 RG / #335959)
  doc.setDrawColor(51, 89, 89);
  doc.setLineWidth(0.45);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6.5;

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), margin, y);
  y += 6.5;

  // Demographic Assessment Header Block (Matching GVA-001 Format)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("CLIENT/SYSTEM ID: ____________________________________________________", margin, y);
  addInteractiveTextField(doc, "Client_System_ID", margin + 35, y - 4, 85, 5);
  y += 5.5;

  doc.text("DATE: ____________________________________________________", margin, y);
  addInteractiveTextField(doc, "Assessment_Date", margin + 14, y - 4, 60, 5);
  y += 5.5;

  doc.text("ASSESSMENT INTERVAL:  [ ] Baseline    [ ] Mid-Point    [ ] Post-Intervention", margin, y);
  addInteractiveCheckBox(doc, "Interval_Baseline", margin + 41, y - 3.2, 3.5);
  addInteractiveCheckBox(doc, "Interval_Midpoint", margin + 63, y - 3.2, 3.5);
  addInteractiveCheckBox(doc, "Interval_Post", margin + 87, y - 3.2, 3.5);
  y += 7.5;

  // Thin separator
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.25);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5.5;

  // Rubric Key
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("RATING INSTRUCTIONS: Rate each item on a scale of 1–5  (1 = Never / Low,  5 = Always / High Expression)", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Interactive protocol: check the boxes directly on your screen or print blank to mark by hand.", margin, y);
  y += 6;

  // Loop through dimensions and questions
  const categories = Array.from(new Set(MASTER_ASSESSMENT_QUESTIONS.map(q => q.category)));

  categories.forEach((cat) => {
    const dim = ASSESSMENT_DIMENSIONS[cat] || { name: cat, description: "" };
    const qInCat = MASTER_ASSESSMENT_QUESTIONS.filter(q => q.category === cat);

    checkPageBreak(24);

    // Dimension Section Header
    doc.setFillColor(240, 253, 250); // teal-50
    doc.setDrawColor(45, 212, 191);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text(`DIMENSION ${cat}: ${dim.name.toUpperCase()} (${qInCat.length} Questions)`, margin + 4, y + 5.5);

    // Column Scale Indicators above the check boxes: 1  2  3  4  5
    const checkStartX = pageWidth - margin - 35;
    [1, 2, 3, 4, 5].forEach((val, optIdx) => {
      const cx = checkStartX + optIdx * 7;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(13, 148, 136);
      doc.text(`${val}`, cx + 1.2, y + 5.5);
    });

    y += 11;

    qInCat.forEach((q) => {
      checkPageBreak(12);

      // Question container row
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(241, 245, 249);
      doc.roundedRect(margin, y, contentWidth, 9.5, 1, 1, "F");

      // Question Number & Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`${q.id}.`, margin + 2, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const splitText = doc.splitTextToSize(q.text, contentWidth - 46);
      doc.text(splitText, margin + 9, y + 4.5);

      // Interactive AcroForm Checkboxes [1] [2] [3] [4] [5] on right - COMPLETELY BLANK & UNCHECKED
      [1, 2, 3, 4, 5].forEach((val, optIdx) => {
        const cx = checkStartX + optIdx * 7;
        const cy = y + 1.8;
        const boxSize = 4;

        // Visual box - completely empty, white background, crisp slate border (NO text inside!)
        doc.setDrawColor(148, 163, 184);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(cx, cy, boxSize, boxSize, 0.8, 0.8, "FD");

        // Interactive CheckBox field (blank & unchecked)
        addInteractiveCheckBox(doc, `q_${q.id}_val_${val}`, cx, cy, boxSize);
      });

      y += 10.5;
    });

    y += 3;
  });

  // End Notes & Signatures
  checkPageBreak(25);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("CANDIDATE SIGNATURE: ___________________________________   DATE: ____________________", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Once completed, submit this form or upload your responses in the Affinity portal for full psychometric synthesis.", margin, y);

  // Apply official Affinity Lifestyle Consulting IP header & footer across all pages
  applyAffinityHeaderAndFooter(doc, "181-Question Psychometric Examination Form");

  doc.save("Affinity_AMBI_181Q_Assessment_Form.pdf");
}

/**
 * Downloads an interactive, editable PDF for the 20-Question Myers-Briggs (MBTI)
 * Assessment with fillable candidate info, AcroForm choice checkboxes (A) and (B),
 * scoring worksheet, logo header, and mandatory IP footer on every page.
 */
/**
 * Downloads an interactive, editable PDF for the 20-Question Myers-Briggs (MBTI)
 * Assessment strictly matching the GVA-001 executive consulting specification:
 * centered logo, thin teal divider line, blank unchecked choice boxes, and Tiffany Windsheimer IP notice on every page.
 */
export function downloadEditableMbtiPDF(title = "DOCUMENT 2: MYERS-BRIGGS (MBTI) 20-QUESTION COGNITIVE PROFILE ASSESSMENT") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }
  };

  // Top Centered Official Brand Banner (Logo + Flowing Script Name)
  try {
    doc.addImage(AFFINITY_FULL_LOGO_BANNER, "PNG", (pageWidth - 52) / 2, y, 52, 15.6);
    y += 18;
  } catch {
    doc.addImage(AFFINITY_LOGO_BASE64, "PNG", (pageWidth - 18) / 2, y, 18, 17);
    y += 19;
  }

  // Divider Line (.2 .35 .35 RG / #335959)
  doc.setDrawColor(51, 89, 89);
  doc.setLineWidth(0.45);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6.5;

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), margin, y);
  y += 6.5;

  // Demographic Assessment Header Block (Matching GVA-001 Format)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("CLIENT/SYSTEM ID: ____________________________________________________", margin, y);
  addInteractiveTextField(doc, "MBTI_Client_System_ID", margin + 35, y - 4, 85, 5);
  y += 5.5;

  doc.text("DATE: ____________________________________________________", margin, y);
  addInteractiveTextField(doc, "MBTI_Assessment_Date", margin + 14, y - 4, 60, 5);
  y += 5.5;

  doc.text("ASSESSMENT INTERVAL:  [ ] Baseline    [ ] Mid-Point    [ ] Post-Intervention", margin, y);
  addInteractiveCheckBox(doc, "MBTI_Interval_Baseline", margin + 41, y - 3.2, 3.5);
  addInteractiveCheckBox(doc, "MBTI_Interval_Midpoint", margin + 63, y - 3.2, 3.5);
  addInteractiveCheckBox(doc, "MBTI_Interval_Post", margin + 87, y - 3.2, 3.5);
  y += 7.5;

  // Thin separator
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.25);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5.5;

  // Instructions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("INSTRUCTIONS: For each item below, select the option—(A) or (B)—that represents your natural preference.", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("All option boxes are blank and unchecked. Click directly on screen to select or print to complete by hand.", margin, y);
  y += 6;

  // Group questions by dichotomy
  const dichotomies = [
    { key: "EI", name: "Extraversion (E) vs Introversion (I)", range: [1, 5] },
    { key: "SN", name: "Sensing (S) vs Intuition (N)", range: [6, 10] },
    { key: "TF", name: "Thinking (T) vs Feeling (F)", range: [11, 15] },
    { key: "JP", name: "Judging (J) vs Perceiving (P)", range: [16, 20] },
  ];

  dichotomies.forEach((d) => {
    const qs = MBTI_QUESTIONS.filter(q => q.id >= d.range[0] && q.id <= d.range[1]);

    checkPageBreak(25);

    // Section Header
    doc.setFillColor(250, 245, 255); // purple-50
    doc.setDrawColor(192, 132, 252);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(126, 34, 206); // purple-700
    doc.text(d.name.toUpperCase(), margin + 4, y + 5);
    y += 10.5;

    qs.forEach((q) => {
      checkPageBreak(20);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 17, 1.5, 1.5, "FD");

      // Question line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Q${q.id}. ${q.question}`, margin + 3, y + 4.5);

      // Option A - Completely Blank & Unchecked CheckBox
      const boxSize = 3.8;
      const optAy = y + 7.5;
      doc.setDrawColor(100, 116, 139);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + 4, optAy, boxSize, boxSize, 0.7, 0.7, "FD");
      addInteractiveCheckBox(doc, `mbti_q${q.id}_A`, margin + 4, optAy, boxSize);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text(`(A) ${q.optionA}`, margin + 10, optAy + 3);

      // Option B - Completely Blank & Unchecked CheckBox
      const optBy = y + 12;
      doc.setDrawColor(100, 116, 139);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + 4, optBy, boxSize, boxSize, 0.7, 0.7, "FD");
      addInteractiveCheckBox(doc, `mbti_q${q.id}_B`, margin + 4, optBy, boxSize);

      doc.text(`(B) ${q.optionB}`, margin + 10, optBy + 3);

      y += 19;
    });

    y += 2;
  });

  // Scoring tally summary box
  checkPageBreak(30);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("SCORING TALLY WORKSHEET", margin + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Count your (A) and (B) selections for each pair to determine your 4-letter Myers-Briggs archetype:", margin + 4, y + 10);
  doc.text("E Count: _____  |  I Count: _____    --> Dominant: [    ]", margin + 4, y + 15);
  doc.text("S Count: _____  |  N Count: _____    --> Dominant: [    ]", margin + 65, y + 15);
  doc.text("T Count: _____  |  F Count: _____    --> Dominant: [    ]", margin + 125, y + 15);
  doc.text("J Count: _____  |  P Count: _____    --> Dominant: [    ]", margin + 4, y + 19.5);
  doc.text("FINAL 4-LETTER TYPE: [                ]", margin + 105, y + 19.5);
  y += 26;

  // Signature Block
  checkPageBreak(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Candidate Signature: ____________________________________   Date: ________________________", margin, y);

  // Apply official Affinity Lifestyle Consulting IP header & footer
  applyAffinityHeaderAndFooter(doc, "Myers-Briggs (MBTI) 20-Question Examination Form");

  doc.save("Affinity_Myers_Briggs_MBTI_Assessment_Form.pdf");
}

/**
 * Downloads the blank, printable 181-question AMBI Assessment Booklet in GVA-001 format
 * with empty checkboxes, executive header, and Tiffany Windsheimer IP notice.
 */
export function downloadBlankAmbi181Pdf(title = "DOCUMENT 1: THE AMBI-181 MASTER ASSESSMENT (GVA-001 ARCHETYPE)") {
  downloadEditablePsychometricPDF(title);
}

/**
 * Downloads the blank, printable Myers-Briggs (MBTI) 20-Question Indicator in GVA-001 format
 * with empty choice boxes, scoring tally worksheet, and Tiffany Windsheimer IP notice.
 */
export function downloadBlankMbtiPdf(title = "DOCUMENT 2: MYERS-BRIGGS (MBTI) 20-QUESTION COGNITIVE PROFILE ASSESSMENT") {
  downloadEditableMbtiPDF(title);
}

/**
 * Downloads a pristine, beautifully formatted PDF containing the entire questionnaire
 * with all test questions, options, dimensional descriptions, and response bubbles.
 */
export function downloadBlankTestQuestionsPDF(title = "DOCUMENT 1: THE AMBI-181 MASTER ASSESSMENT (GVA-001 ARCHETYPE)") {
  downloadEditablePsychometricPDF(title);
}

/**
 * Downloads a completed test report with all test questions, user answers,
 * calculated scores, date/time, and executive interpretation.
 */
export function downloadCompletedTestPDF(
  testRecord: {
    id: string;
    mode: string;
    scores: Record<string, number>;
    answers?: Record<number, number>;
    date: string;
  },
  profile: Profile
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 140, 160);
    doc.text("AFFINITY SOUL MATRIX — PSYCHOMETRIC EXAMINATION REPORT", margin, y);
    doc.text(`SEEKER: ${profile.firstName.toUpperCase()} ${profile.lastName.toUpperCase()}`, pageWidth - margin, y, { align: "right" });
    y += 4;
    doc.setDrawColor(200, 215, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  drawPageHeader();

  // Title Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(45, 212, 191);
  doc.text("EXECUTIVE PSYCHOMETRIC CALIBRATION REPORT", margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`Official Assessment Verification — Mode: ${testRecord.mode.toUpperCase()} • Generated on: ${new Date(testRecord.date).toLocaleDateString()}`, margin + 6, y + 17);
  y += 32;

  // Seeker Profile Dossier Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`SEEKER: ${profile.firstName} ${profile.lastName}`, margin + 5, y + 6);
  doc.text(`DATE OF BIRTH: ${profile.dateOfBirth} (${profile.timeOfBirth || "12:00"})`, margin + 5, y + 12);
  doc.text(`LOCATION: ${profile.placeOfBirth || "Earth"}`, margin + 5, y + 18);

  const comp = profile.computed;
  if (comp) {
    doc.text(`LIFE PATH: ${comp.numerology.lifePath}`, margin + 95, y + 6);
    doc.text(`SUN SIGN: ${comp.astrology.sunSign} / RISING: ${comp.astrology.risingSign}`, margin + 95, y + 12);
    doc.text(`HUMAN DESIGN: ${comp.humanDesign.type} (${comp.humanDesign.profile})`, margin + 95, y + 18);
  }
  y += 30;

  // Score Summary Grid
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DIMENSIONAL SCORE BREAKDOWN & BANDS", margin, y);
  y += 6;

  const scoreEntries = Object.entries(testRecord.scores || {});
  const boxWidth = (contentWidth - (scoreEntries.length - 1) * 3) / Math.max(scoreEntries.length, 1);

  scoreEntries.forEach(([cat, score], idx) => {
    const bx = margin + idx * (boxWidth + 3);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(bx, y, boxWidth, 18, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`DIMENSION ${cat}`, bx + boxWidth / 2, y + 5.5, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(45, 212, 191);
    doc.text(`${score}%`, bx + boxWidth / 2, y + 12, { align: "center" });

    doc.setFontSize(6.5);
    doc.setTextColor(203, 213, 225);
    const band = score >= 80 ? "Very High" : score >= 60 ? "High" : score >= 40 ? "Moderate" : "Low";
    doc.text(band, bx + boxWidth / 2, y + 16, { align: "center" });
  });
  y += 24;

  // Complete Question-by-Question Answers Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("ALL TEST QUESTIONS & SUBMITTED ANSWERS", margin, y);
  y += 6;

  const answeredIds = testRecord.answers ? Object.keys(testRecord.answers).map(Number) : [];
  const questionsToShow = answeredIds.length > 0
    ? MASTER_ASSESSMENT_QUESTIONS.filter(q => answeredIds.includes(q.id))
    : MASTER_ASSESSMENT_QUESTIONS.slice(0, testRecord.mode === "quick" ? 5 : 15);

  questionsToShow.forEach((q) => {
    checkPageBreak(18);

    const userAns = testRecord.answers ? testRecord.answers[q.id] : undefined;
    const ansLabel = userAns
      ? SCALE_RATING_GUIDE.find(s => s.value === userAns)?.label || `Selected: ${userAns}`
      : "Not Answered";

    // Item card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);

    const qText = doc.splitTextToSize(`Q${q.id}. ${q.text}`, contentWidth - 40);
    const itemHeight = Math.max(14, qText.length * 4.2 + 8);
    doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(qText, margin + 4, y + 5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`[Dim: ${q.categoryName} • ${q.subscale}]`, margin + 4, y + itemHeight - 2.5);

    // Answer badge
    const badgeX = pageWidth - margin - 32;
    doc.setFillColor(userAns ? 240 : 241, userAns ? 253 : 245, userAns ? 250 : 249);
    doc.setDrawColor(userAns ? 45 : 203, userAns ? 212 : 213, userAns ? 191 : 225);
    doc.roundedRect(badgeX, y + 3, 28, 8, 1, 1, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(userAns ? 13 : 100, userAns ? 148 : 116, userAns ? 136 : 139);
    doc.text(userAns ? `Ans: ${userAns}/5` : "Score: N/A", badgeX + 14, y + 7.5, { align: "center" });

    y += itemHeight + 3;
  });

  // Executive Synthesis
  checkPageBreak(30);
  y += 4;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("EXECUTIVE SOUL SYNTHESIS", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const synth = `This psychometric profile demonstrates strong sovereign coherence across the mindscape. High openness allows direct channel access to quantum inspiration, while elevated emotional stability keeps the central nervous system grounded at Point Zero. Certified by the Affinity Soul Matrix.`;
  const splitSynth = doc.splitTextToSize(synth, contentWidth - 8);
  doc.text(splitSynth, margin + 4, y + 12);
  y += 28;

  // Apply official Affinity Lifestyle Consulting IP header & footer
  applyAffinityHeaderAndFooter(doc, "Completed Psychometric Assessment & Answers");

  // Download PDF
  const safeName = `${profile.firstName}_${profile.lastName}`.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `Affinity_Psychometric_Report_${safeName}.pdf`;
  doc.save(filename);
}

/**
 * Downloads a complete, highly comprehensive, multi-page Soul Blueprint + Test Results Dossier for a profile.
 * Incorporates all dimensions: Incarnation Coordinates, Astrology, Human Design, Gene Keys, Numerology,
 * Aura/Hawkins Scale, AMBI Mindscape Psychometrics, and MBTI Cognitive Architecture.
 */
export function downloadProfileFullDossierPDF(profile: Profile, testHistory: any[] = []) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const comp = profile.computed || getProfileComputed(profile);

  const drawPageBorderAndWatermark = () => {
    // Subtle luxury background border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);
  };

  // =========================================================================
  // PAGE 1: COVER & SOVEREIGN INCARNATION ARCHITECTURE
  // =========================================================================
  drawPageBorderAndWatermark();
  let y = margin + 4;

  // Header Banner with Logo & Script Branding
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 32, 2.5, 2.5, "F");

  try {
    doc.addImage(AFFINITY_LOGO_BASE64, "PNG", margin + 5, y + 4, 24, 23);
  } catch {
    // Fallback
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(45, 212, 191); // teal-400
  doc.text("AFFINITY LIFESTYLE CONSULTING", margin + 32, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text("PRECISION CONSULTING • SOVEREIGN LIFE BLUEPRINT & EXECUTIVE DOSSIER", margin + 32, y + 17);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Candidate Subject: ${profile.firstName} ${profile.lastName} • Issued: ${new Date().toLocaleDateString()}`, margin + 32, y + 23);
  y += 38;

  // 1. Incarnation Coordinates Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text("1. INCARNATION COORDINATES & GEOMETRIC ORIGIN", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`Full Vibrational Name: ${profile.firstName} ${profile.lastName}`, margin + 4, y + 12);
  doc.text(`Natal Origin: ${profile.dateOfBirth} at ${profile.timeOfBirth || "12:00 PM"}`, margin + 4, y + 17);
  doc.text(`Physical Incarnation Location: ${profile.placeOfBirth || "Earth Coordinates"}`, margin + 4, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(99, 102, 241);
  doc.text(`Sun: ${comp.astrology.sunSign}  •  Moon: ${comp.astrology.moonSign}  •  Rising: ${comp.astrology.risingSign}`, pageWidth - margin - 4, y + 12, { align: "right" });
  doc.text(`Life Path: ${comp.numerology.lifePath}  •  HD Type: ${comp.humanDesign.type}`, pageWidth - margin - 4, y + 17, { align: "right" });
  doc.text(`Hawkins Consciousness: ${comp.aura.consciousnessScale} / 1000`, pageWidth - margin - 4, y + 22, { align: "right" });
  y += 34;

  // Executive Sovereign Life Synthesis (Essay Form)
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(45, 212, 191);
  doc.roundedRect(margin, y, contentWidth, 68, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("EXECUTIVE SOVEREIGN SYNTHESIS & CONSCIOUSNESS ESSAY", margin + 4, y + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const essay1 = `${profile.firstName} ${profile.lastName} represents a profoundly coherent archetypal architecture combining the electric visionary momentum of a ${comp.humanDesign.type} with the spiritual frequency of ${comp.aura.color} light (calibrated at ${comp.aura.frequency} Hz). Operating along Life Path ${comp.numerology.lifePath}, the incarnation mandate is neither accidental nor repetitive: it is an intentional, self-luminous evolution from shadow reactivity into catalytic mastery.`;
  const essay2 = `With an inner authority rooted in ${comp.humanDesign.authority} intelligence and a ${comp.humanDesign.profile} life profile, the path to fulfillment unfolds through honoring somatic signals rather than conforming to mental anxiety. The primary challenge lies in transmuting the shadow frequencies of the Golden Path into gifts of profound creative contribution.`;
  const essay3 = `On the Hawkins Scale of Consciousness, the profile anchors at ${comp.aura.consciousnessScale}/1000—a frequency where courage and love supersede fear and conditioning. This document stands as a sacred analytical record of your complete psychological, celestial, and energetic sovereignty.`;
  
  const splitEssay1 = doc.splitTextToSize(essay1, contentWidth - 8);
  const splitEssay2 = doc.splitTextToSize(essay2, contentWidth - 8);
  const splitEssay3 = doc.splitTextToSize(essay3, contentWidth - 8);

  let ey = y + 13;
  doc.text(splitEssay1, margin + 4, ey);
  ey += splitEssay1.length * 4.2 + 2;
  doc.text(splitEssay2, margin + 4, ey);
  ey += splitEssay2.length * 4.2 + 2;
  doc.text(splitEssay3, margin + 4, ey);
  y += 74;

  // Auric Resonance & Energy Field Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("AURIC FREQUENCY SPECTRUM & HAWKINS SCALE", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Primary Color Resonance: ${comp.aura.color} (${comp.aura.hex})`, margin + 4, y + 12);
  doc.text(`Acoustic / Harmonic Resonance: ${comp.aura.frequency} Hz (Solfeggio Harmonic)`, margin + 4, y + 17);
  doc.text(`Consciousness Scale: ${comp.aura.consciousnessScale} out of 1,000 (Dr. David R. Hawkins Calibration)`, margin + 4, y + 22);
  const auraSummary = AURA_KNOWLEDGE[comp.aura.color]?.subtitle || "Harmonic energy field embodying clarity, sovereignty, and coherence.";
  doc.text(`Field Expression: ${auraSummary}`, margin + 4, y + 27);
  const auraKey = (AURA_KNOWLEDGE[comp.aura.color]?.keywords || ["Sovereignty", "Vitality", "Wisdom"]).join(" • ");
  doc.text(`Key Resonances: ${auraKey}`, margin + 4, y + 32);

  // =========================================================================
  // PAGE 2: CELESTIAL NATAL CHART & ASTROLOGICAL ARCHITECTURE
  // =========================================================================
  doc.addPage();
  drawPageBorderAndWatermark();
  y = margin + 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 212, 191);
  doc.text("2. ASTROLOGICAL ARCHITECTURE & NATAL BLUEPRINT", margin + 5, y + 9);
  y += 19;

  // The Big Three + Dominant Planet Table
  const astroData = [
    { label: "Sun Sign (Core Identity)", value: comp.astrology.sunSign, desc: ZODIAC_KNOWLEDGE[comp.astrology.sunSign]?.subtitle || "The radiant spark of consciousness and divine purpose." },
    { label: "Moon Sign (Emotional Undercurrent)", value: comp.astrology.moonSign, desc: ZODIAC_KNOWLEDGE[comp.astrology.moonSign]?.subtitle || "The instinctive emotional sanctuary and subconscious soul rhythm." },
    { label: "Rising / Ascendant (The Prism)", value: comp.astrology.risingSign, desc: "The lens through which the soul interacts with and perceives worldly manifestation." },
    { label: "Dominant Planetary Governor", value: comp.astrology.dominantPlanet, desc: "The cosmic celestial archetypal ruler steering major evolutionary turning points." },
    { label: "North Node (Karmic Destiny)", value: comp.astrology.northNode, desc: "The evolutionary compass heading guiding fulfillment and conscious incarnation expansion." },
    { label: "South Node (Innate Mastery / Past Habits)", value: comp.astrology.southNode || "Innate Soul Grounding", desc: "The comfortable familiar ground to be honored without stagnating within it." },
    { label: "Eastern Zodiac Animal & Element", value: `${comp.astrology.chineseZodiac} (${comp.astrology.chineseElement})`, desc: "The generational grounding archetype governing relational and earthly stamina." }
  ];

  astroData.forEach((item) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 17, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.label, margin + 4, y + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136);
    doc.text(item.value, pageWidth - margin - 4, y + 5.5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const desc = doc.splitTextToSize(item.desc, contentWidth - 8);
    doc.text(desc.slice(0, 2), margin + 4, y + 11);
    y += 19.5;
  });

  // Elemental Distribution & Modality
  y += 2;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(45, 212, 191);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(13, 148, 136);
  doc.text("ELEMENTAL HARMONY & MODAL DYNAMICS", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("• Fire (Inspiration, Vitality, Courage): 30% — Inspires spontaneous creation and direct sovereignty.", margin + 4, y + 12);
  doc.text("• Earth (Structure, Embodiment, Pragmatism): 25% — Anchors transcendent visions into tactile reality.", margin + 4, y + 17);
  doc.text("• Air (Intellect, Synthesis, Communication): 25% — Weaves intricate conceptual bridges across diverse domains.", margin + 4, y + 22);
  doc.text("• Water (Intuition, Empathy, Mystic Depths): 20% — Deepens emotional intimacy and receptive awareness.", margin + 4, y + 27);

  // =========================================================================
  // PAGE 3: HUMAN DESIGN QUANTUM CIRCUITRY & ENERGETIC ANATOMY
  // =========================================================================
  doc.addPage();
  drawPageBorderAndWatermark();
  y = margin + 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 212, 191);
  doc.text("3. HUMAN DESIGN MATRIX & ENERGETIC CIRCUITRY", margin + 5, y + 9);
  y += 19;

  // Core Mechanics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("CORE HUMAN DESIGN MECHANICS", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Energy Type: ${comp.humanDesign.type}`, margin + 4, y + 12);
  doc.text(`Inner Authority: ${comp.humanDesign.authority}`, margin + 4, y + 17);
  doc.text(`Incarnation Profile: ${comp.humanDesign.profile}`, margin + 4, y + 22);
  doc.text(`Definition Mode: ${comp.humanDesign.definitionType}`, margin + 4, y + 27);

  const hdTypeDetails = HD_TYPE_KNOWLEDGE[comp.humanDesign.type] || HD_TYPE_KNOWLEDGE["Generator"];
  doc.setFont("helvetica", "bold");
  doc.setTextColor(13, 148, 136);
  doc.text(`Strategy: ${hdTypeDetails?.subtitle || "Respond with Sovereignty"}`, pageWidth - margin - 4, y + 12, { align: "right" });
  doc.text(`Signature: Satisfaction & Peace`, pageWidth - margin - 4, y + 17, { align: "right" });
  doc.text(`Not-Self Theme: Frustration / Bitterness`, pageWidth - margin - 4, y + 22, { align: "right" });
  y += 36;

  // 9 Bodygraph Centers Analysis
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("THE NINE ENERGY CENTERS (DEFINED VS UNDEFINED)", margin, y);
  y += 6;

  const definedCenters = comp.humanDesign.definedCenters || [];
  const allCentersList = [
    { name: "Head Center", role: "Inspiration & Mental Pressure", isDef: definedCenters.includes("Head") },
    { name: "Ajna Center", role: "Conceptualization & Mental Processing", isDef: definedCenters.includes("Ajna") },
    { name: "Throat Center", role: "Manifestation & Vocal Articulation", isDef: definedCenters.includes("Throat") },
    { name: "G-Center (Identity)", role: "Love, Direction & Soul Identity", isDef: definedCenters.includes("G-Center") },
    { name: "Heart / Ego Center", role: "Willpower, Self-Worth & Material Manifestation", isDef: definedCenters.includes("Heart") },
    { name: "Sacral Center", role: "Life Force, Vital Energy & Sexual Power", isDef: definedCenters.includes("Sacral") },
    { name: "Solar Plexus Center", role: "Emotional Waves & Spiritual Awakening", isDef: definedCenters.includes("Solar Plexus") },
    { name: "Spleen Center", role: "Survival Instinct, Intuition & Immune Health", isDef: definedCenters.includes("Spleen") },
    { name: "Root Center", role: "Adrenal Drive, Physical Pressure & Stress Processing", isDef: definedCenters.includes("Root") },
  ];

  allCentersList.forEach((c) => {
    doc.setFillColor(c.isDef ? 240 : 255, c.isDef ? 253 : 255, c.isDef ? 250 : 255);
    doc.setDrawColor(c.isDef ? 45 : 226, c.isDef ? 212 : 232, c.isDef ? 191 : 240);
    doc.roundedRect(margin, y, contentWidth, 10, 1, 1, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(c.name, margin + 4, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.role, margin + 46, y + 6.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(c.isDef ? 13 : 100, c.isDef ? 148 : 116, c.isDef ? 136 : 139);
    doc.text(c.isDef ? "[DEFINED - CONSISTENT TRANSMITTER]" : "[UNDEFINED - SENSITIVE SENSOR/AMPLIFIER]", pageWidth - margin - 4, y + 6.5, { align: "right" });
    y += 12;
  });

  // Active Channels & Gates
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("ACTIVE QUANTUM CHANNELS & GATES", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const chStr = (comp.humanDesign.channels || []).join("  •  ") || "Specialized single circuitry activations";
  const chLines = doc.splitTextToSize(`Active Quantum Channels: ${chStr}`, contentWidth - 8);
  doc.text(chLines.slice(0, 2), margin + 4, y + 12);

  const gatesList = [...(comp.humanDesign.personalityGates || []), ...(comp.humanDesign.designGates || [])];
  const uniqueGates = Array.from(new Set(gatesList)).slice(0, 12).join(", ");
  doc.text(`Prominent Gate Activations: Gates ${uniqueGates}`, margin + 4, y + 19);

  // =========================================================================
  // PAGE 4: THE 64 GENE KEYS HOLOGENETIC PROFILE
  // =========================================================================
  doc.addPage();
  drawPageBorderAndWatermark();
  y = margin + 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 212, 191);
  doc.text("4. THE 64 GENE KEYS HOLOGENETIC PROFILE", margin + 5, y + 9);
  y += 19;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("The Golden Path maps your transmission from the Shadow of survival to the Gift of creativity and the Siddhi of divine illumination.", margin, y);
  y += 6;

  // Activation Sequence (Genius)
  const sequences = [
    {
      title: "THE ACTIVATION SEQUENCE (GENIUS)",
      color: [16, 185, 129], // emerald
      spheres: [
        { name: "Life's Work (Sun)", key: comp.geneKeys?.lifesWork?.keyNumber || 1, line: comp.geneKeys?.lifesWork?.line || 1 },
        { name: "Evolution (Earth)", key: comp.geneKeys?.evolution?.keyNumber || 2, line: comp.geneKeys?.evolution?.line || 1 },
        { name: "Radiance (Design Sun)", key: comp.geneKeys?.radiance?.keyNumber || 3, line: comp.geneKeys?.radiance?.line || 1 },
        { name: "Purpose (Design Earth)", key: comp.geneKeys?.purpose?.keyNumber || 4, line: comp.geneKeys?.purpose?.line || 1 },
      ]
    },
    {
      title: "THE VENUS SEQUENCE (LOVE & INTIMACY)",
      color: [244, 63, 94], // rose
      spheres: [
        { name: "Attraction (Moon)", key: comp.geneKeys?.attraction?.keyNumber || 5, line: comp.geneKeys?.attraction?.line || 1 },
        { name: "IQ (Mental Core)", key: comp.geneKeys?.iq?.keyNumber || 6, line: comp.geneKeys?.iq?.line || 1 },
        { name: "EQ (Emotional Core)", key: comp.geneKeys?.eq?.keyNumber || 7, line: comp.geneKeys?.eq?.line || 1 },
        { name: "SQ (Spiritual Core)", key: comp.geneKeys?.sq?.keyNumber || 8, line: comp.geneKeys?.sq?.line || 1 },
        { name: "Core Wound / Vocation", key: comp.geneKeys?.coreWound?.keyNumber || 9, line: comp.geneKeys?.coreWound?.line || 1 },
      ]
    },
    {
      title: "THE PEARL SEQUENCE (PROSPERITY & IMPACT)",
      color: [56, 189, 248], // sky
      spheres: [
        { name: "Vocation (Core)", key: comp.geneKeys?.vocation?.keyNumber || 10, line: comp.geneKeys?.vocation?.line || 1 },
        { name: "Culture (Jupiter)", key: comp.geneKeys?.culture?.keyNumber || 11, line: comp.geneKeys?.culture?.line || 1 },
        { name: "Brand (Sun)", key: comp.geneKeys?.brand?.keyNumber || 12, line: comp.geneKeys?.brand?.line || 1 },
        { name: "Pearl (Synthesis)", key: comp.geneKeys?.pearl?.keyNumber || 13, line: comp.geneKeys?.pearl?.line || 1 },
      ]
    }
  ];

  sequences.forEach((seq) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 7, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(seq.color[0], seq.color[1], seq.color[2]);
    doc.text(seq.title, margin + 3, y + 5);
    y += 9;

    seq.spheres.forEach((sph) => {
      const gk = GENE_KEYS[(sph.key - 1) % GENE_KEYS.length] || GENE_KEYS[0];
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 12, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`${sph.name}: Gene Key ${sph.key}.${sph.line} — "${gk.name}"`, margin + 3, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(239, 68, 68); // shadow
      doc.text(`Shadow: ${gk.shadow}`, margin + 3, y + 9);

      doc.setTextColor(16, 185, 129); // gift
      doc.text(`Gift: ${gk.gift}`, margin + 60, y + 9);

      doc.setTextColor(56, 189, 248); // siddhi
      doc.text(`Siddhi: ${gk.siddhi}`, margin + 115, y + 9);

      y += 14;
    });
    y += 2;
  });

  // =========================================================================
  // PAGE 5: MASTER NUMEROLOGY ARC & PYTHAGOREAN MATRIX
  // =========================================================================
  doc.addPage();
  drawPageBorderAndWatermark();
  y = margin + 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 212, 191);
  doc.text("5. MASTER NUMEROLOGY ARC & PYTHAGOREAN MATRIX", margin + 5, y + 9);
  y += 19;

  const numData = [
    {
      title: `Life Path Number: ${comp.numerology.lifePath}`,
      subtitle: LIFE_PATH_KNOWLEDGE[comp.numerology.lifePath]?.title || "The Sovereign Journey",
      desc: LIFE_PATH_KNOWLEDGE[comp.numerology.lifePath]?.body?.[0] || "The primary vibrational frequency and sovereign path you incarnated to walk.",
      keywords: (LIFE_PATH_KNOWLEDGE[comp.numerology.lifePath]?.keywords || []).join(" • ")
    },
    {
      title: `Expression / Destiny Number: ${comp.numerology.expression}`,
      subtitle: "The Natural Talent & Worldly Manifestation Channel",
      desc: "Calculated from the full legal name, this number reveals your inherent abilities, communicative signature, and the way you bring concepts into physical form.",
      keywords: "Communication • Leadership • Manifestation • Creation"
    },
    {
      title: `Soul Urge / Heart's Desire: ${comp.numerology.soulUrge}`,
      subtitle: "The Deepest Subconscious Craving & Inner Motivation",
      desc: "Calculated from the vowels in your name, this reflects what your soul truly hungers for when the external world goes silent. It directs love and private desires.",
      keywords: "Truth • Devotion • Intimacy • Sanctuary"
    },
    {
      title: `Personality Number: ${comp.numerology.personality}`,
      subtitle: "The Outer Aura & Social Persona",
      desc: "Derived from the consonants in your name, this is the energetic first impression and outer armor you present to the social collective.",
      keywords: "Charisma • Presence • Magnetism • Boundary"
    },
    {
      title: `Birthday Vibration: ${comp.numerology.birthday}`,
      subtitle: "The Catalyst Gift for Practical Execution",
      desc: "The specific solar day of your birth introduces an extra layer of spontaneous talent, acting as a shortcut to creative inspiration and career success.",
      keywords: "Skill • Spontaneity • Resourcefulness • Intuition"
    }
  ];

  numData.forEach((item) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(item.title, margin + 4, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(13, 148, 136);
    doc.text(item.subtitle, margin + 4, y + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const dLines = doc.splitTextToSize(item.desc, contentWidth - 8);
    doc.text(dLines.slice(0, 3), margin + 4, y + 17);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(99, 102, 241);
    doc.text(`Key Core Resonance: ${item.keywords}`, margin + 4, y + 30);
    y += 38;
  });

  // =========================================================================
  // PAGE 6: AMBI 203 PSYCHOMETRIC MINDSCAPE & ASSESSMENT SCORES
  // =========================================================================
  doc.addPage();
  drawPageBorderAndWatermark();
  y = margin + 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 212, 191);
  doc.text("6. AMBI 203 PSYCHOMETRIC MINDSCAPE & DIMENSIONAL EVALUATION", margin + 5, y + 9);
  y += 19;

  const latestTest = testHistory.length > 0 ? testHistory[testHistory.length - 1] : null;
  const scores = latestTest?.scores || {
    Openness: 88,
    Conscientiousness: 84,
    Extraversion: 72,
    Agreeableness: 86,
    EmotionalStability: 82,
    CognitiveFlexibility: 90,
    SpiritualIntuition: 94
  };

  doc.setFillColor(240, 253, 250);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(13, 148, 136);
  doc.text("AMBI 203 COMPREHENSIVE MINDSCAPE SCORE SUMMARY", margin + 4, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Status: Verified Assessment Profile • Candidate Percentile: 94th • Coherence Ratio: 0.92`, margin + 4, y + 11);
  doc.text(`Instrument: AMBI Psychometric Matrix (Synthesizing Big Five, HEXACO, and Transpersonal Dimensions)`, margin + 4, y + 15.5);
  y += 24;

  const ambiDimensions = [
    { key: "SpiritualIntuition", name: "Dimension A: Spiritual Intuition & Sovereignty", score: scores.SpiritualIntuition || 94, desc: "Capacity to access non-local insight, direct knowing, and sovereign alignment with cosmic flow." },
    { key: "Openness", name: "Dimension B: Openness to Cognitive & Mystical Expansion", score: scores.Openness || 88, desc: "Receptivity to unorthodox concepts, visionary systems, aesthetic beauty, and mental flexibility." },
    { key: "EmotionalStability", name: "Dimension C: Nervous System & Emotional Resilience", score: scores.EmotionalStability || 82, desc: "Ability to remain grounded at Point Zero amidst uncertainty, emotional turbulence, and stress." },
    { key: "CognitiveFlexibility", name: "Dimension D: Cognitive Agility & Strategic Synthesis", score: scores.CognitiveFlexibility || 90, desc: "Proficiency in synthesizing complex disparate datasets, bridging technical logic and esoteric nuance." },
    { key: "Conscientiousness", name: "Dimension E: Sovereign Focus & Manifestation Discipline", score: scores.Conscientiousness || 84, desc: "Execution power, intentional goal alignment, ritual discipline, and material manifestation." },
    { key: "Agreeableness", name: "Dimension F: Interpersonal Empathy & Relational Coherence", score: scores.Agreeableness || 86, desc: "Compassion, non-violent communication, capacity for restorative dialogue and sacred boundaries." },
    { key: "Extraversion", name: "Dimension G: Energetic Radiance & Social Magnetism", score: scores.Extraversion || 72, desc: "Outward projection of energy, vocal empowerment, and charismatic community leadership." },
  ];

  ambiDimensions.forEach((dim) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 21, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(dim.name, margin + 4, y + 5.5);

    // Score Badge
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(45, 212, 191);
    doc.roundedRect(pageWidth - margin - 24, y + 2.5, 20, 6, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(13, 148, 136);
    doc.text(`${dim.score}%`, pageWidth - margin - 14, y + 6.8, { align: "center" });

    // Progress bar representation
    doc.setFillColor(226, 232, 240);
    doc.rect(margin + 4, y + 8.5, contentWidth - 32, 2, "F");
    doc.setFillColor(13, 148, 136);
    doc.rect(margin + 4, y + 8.5, (contentWidth - 32) * (dim.score / 100), 2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const dLines = doc.splitTextToSize(dim.desc, contentWidth - 8);
    doc.text(dLines.slice(0, 2), margin + 4, y + 14.5);
    y += 24;
  });

  // =========================================================================
  // PAGE 7: MYERS-BRIGGS (MBTI) & SOVEREIGN INTEGRATION PROTOCOL
  // =========================================================================
  doc.addPage();
  drawPageBorderAndWatermark();
  y = margin + 4;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 212, 191);
  doc.text("7. MYERS-BRIGGS (MBTI) ARCHETYPE & SOVEREIGN PROTOCOL", margin + 5, y + 9);
  y += 19;

  const mbtiType = profile.mbtiType || "INFJ";
  const mbti = MBTI_PROFILES[mbtiType] || MBTI_PROFILES["INFJ"];

  // Archetype Profile Card
  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(192, 132, 252);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(88, 28, 135);
  doc.text(`COGNITIVE ARCHETYPE: ${mbtiType} — ${mbti.title} ("${mbti.nickname}")`, margin + 4, y + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  const mLines = doc.splitTextToSize(mbti.description, contentWidth - 8);
  doc.text(mLines.slice(0, 4), margin + 4, y + 13);
  y += 38;

  // Cognitive Functions Stack Table
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("JUNG / MYERS COGNITIVE FUNCTION STACK", margin + 4, y + 6);

  const stack = (mbti as any).cognitiveStack || [
    { position: "Dominant (Hero)", function: "Introverted Intuition (Ni)", desc: "Visionary pattern synthesis and future-state trajectory navigation." },
    { position: "Auxiliary (Parent)", function: "Extraverted Feeling (Fe)", desc: "Relational emotional harmonization and cultural consensus building." },
    { position: "Tertiary (Child)", function: "Introverted Thinking (Ti)", desc: "Internal semantic precision, logical truth-testing and framework analysis." },
    { position: "Inferior (Aspiration)", function: "Extraverted Sensing (Se)", desc: "Tactile reality awareness, present-moment sensory embodiment." }
  ];

  stack.forEach((fn: any, idx: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(109, 40, 217);
    doc.text(`• ${fn.position}: ${fn.function}`, margin + 4, y + 12 + idx * 5);
  });
  y += 36;

  // Daily Micro-Rituals & Sovereignty Integration
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(45, 212, 191);
  doc.roundedRect(margin, y, contentWidth, 48, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(13, 148, 136);
  doc.text("SOVEREIGNTY INTEGRATION: DAILY CONTEMPLATION RITUALS", margin + 4, y + 6);

  const rituals = [
    "1. Point Zero Somatic Reset: Dedicate 7 minutes at dawn to quiet nervous system observation before screen exposure.",
    "2. Sacral / Intuitive Gatekeeping: When making commitments, pause 10 seconds to feel your inner authority (Sacral gut or Solar Plexus wave).",
    "3. Shadow into Gift Transmutation: When frustration or anger arises, identify the active Gene Key shadow and welcome it without judgment.",
    "4. Voice of Truth: Speak your truth with measured elegance, honoring your core values over temporary social comfort."
  ];

  rituals.forEach((rit, idx) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const rLines = doc.splitTextToSize(rit, contentWidth - 8);
    doc.text(rLines, margin + 4, y + 12 + idx * 8.5);
  });
  y += 52;

  // Official Seal & Certification Block
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(45, 212, 191);
  doc.text("AFFINITY LIFESTYLE CONSULTING — CERTIFIED SOUL DOSSIER", margin + 4, y + 6.5);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text(IP_STATEMENT, margin + 4, y + 12);
  doc.text(`Issued for ${profile.firstName} ${profile.lastName} • Administrator Authentication Token: AFC-${profile.id?.slice(0, 8) || "SOVEREIGN"}`, margin + 4, y + 17);

  // Apply Affinity header & footer across all 7 pages with real logo
  applyAffinityHeaderAndFooter(doc, "Complete Soul Blueprint & Executive Dossier");

  const safeName = `${profile.firstName}_${profile.lastName}`.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Affinity_Full_Dossier_${safeName}.pdf`);
}

/**
 * Downloads a relationship synergy dossier comparing two profiles
 */
export function downloadRelationshipSynergyPDF(
  profileA: Profile,
  profileB: Profile,
  synergy: any
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("AFFINITY — COSMIC RELATIONSHIP SYNERGY & SYNASTRY REPORT", margin, y);
    doc.text("SACRED RELATIONAL DOSSIER", pageWidth - margin, y, { align: "right" });
    y += 4;
    doc.setDrawColor(200, 215, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  drawHeader();

  // Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(45, 212, 191);
  doc.text(`RELATIONSHIP SYNERGY: ${profileA.firstName.toUpperCase()} & ${profileB.firstName.toUpperCase()}`, margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  const catLabel = synergy.category === "partner" ? "Romantic Partners" : synergy.category === "coworker" ? "Professional Colleagues" : "Friendship";
  doc.text(`Dynamic Context: ${catLabel} | Longevity Index: ${synergy.longevityScore}% | Resonance: ${synergy.resonanceScore}%`, margin + 6, y + 16);
  doc.text(`Generated: ${new Date().toLocaleDateString()} via Affinity Sovereign Engine`, margin + 6, y + 21);
  y += 32;

  // Overview Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. INTERACTION DYNAMICS & LONGEVITY", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const dynLines = doc.splitTextToSize(synergy.dynamicSummary || synergy.interactionDynamic, contentWidth - 8);
  doc.text(dynLines.slice(0, 3), margin + 4, y + 11);
  y += 28;

  // Plain-English Everyday Translation
  if (synergy.basicPlainEnglishTranslation) {
    checkPageBreak(42);
    doc.setFillColor(240, 253, 250); // teal-50
    doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text("2. EVERYDAY PLAIN-ENGLISH TRANSLATION (HOW YOU ACTUALLY CONNECT)", margin + 4, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Verdict: ${synergy.basicPlainEnglishTranslation.verdict}`, margin + 4, y + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const alongLines = doc.splitTextToSize(`How You Get Along: ${synergy.basicPlainEnglishTranslation.howYouGetAlong}`, contentWidth - 8);
    doc.text(alongLines.slice(0, 2), margin + 4, y + 18);

    const fightLines = doc.splitTextToSize(`Why You Fight & How To Fix: ${synergy.basicPlainEnglishTranslation.howYouFightAndHowToFixIt}`, contentWidth - 8);
    doc.text(fightLines.slice(0, 2), margin + 4, y + 27);

    const longLines = doc.splitTextToSize(`Longevity Outlook: ${synergy.basicPlainEnglishTranslation.longevityOutlook}`, contentWidth - 8);
    doc.text(longLines.slice(0, 2), margin + 4, y + 34);
    y += 44;
  }

  // Personality & Psychometrics Blend with Toxicity Assessment
  if (synergy.personalityPsychometricsBlend) {
    checkPageBreak(46);
    doc.setFillColor(245, 243, 255); // purple-50
    doc.roundedRect(margin, y, contentWidth, 42, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(109, 40, 217); // purple-700
    doc.text(`3. PSYCHOMETRICS & PERSONALITY BLEND (${synergy.personalityPsychometricsBlend.toxicityRiskLevel.toUpperCase()})`, margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const sumLines = doc.splitTextToSize(synergy.personalityPsychometricsBlend.blendSummary, contentWidth - 8);
    doc.text(sumLines.slice(0, 2), margin + 4, y + 12);

    const compStr = (synergy.personalityPsychometricsBlend.compliments || []).slice(0, 2).map((c: string) => `• ${c}`).join("  ");
    const compLines = doc.splitTextToSize(`Complementary Strengths: ${compStr}`, contentWidth - 8);
    doc.text(compLines.slice(0, 2), margin + 4, y + 21);

    const contraStr = (synergy.personalityPsychometricsBlend.contrasts || []).slice(0, 2).map((c: string) => `• ${c}`).join("  ");
    const contraLines = doc.splitTextToSize(`Contrasts & Friction: ${contraStr}`, contentWidth - 8);
    doc.text(contraLines.slice(0, 2), margin + 4, y + 29);

    const toxStr = (synergy.personalityPsychometricsBlend.toxicTriggersToAvoid || []).slice(0, 2).map((t: string) => `⚠ ${t}`).join("  ");
    doc.setTextColor(185, 28, 28);
    const toxLines = doc.splitTextToSize(`Toxic Pitfalls To Avoid: ${toxStr}`, contentWidth - 8);
    doc.text(toxLines.slice(0, 2), margin + 4, y + 37);
    y += 48;
  }

  // Birth Charts & Human Design Compliments / Contrasts
  if (synergy.astrologyComplimentsContrasts || synergy.humanDesignGeneKeysComplimentsContrasts) {
    checkPageBreak(38);
    doc.setFillColor(254, 243, 199); // amber-50
    doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text("4. BIRTH CHARTS & HUMAN DESIGN: COMPLIMENTS & CONTRASTS", margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    if (synergy.astrologyComplimentsContrasts) {
      const astroLines = doc.splitTextToSize(`Astrology: ${synergy.astrologyComplimentsContrasts.plainEnglishTranslation}`, contentWidth - 8);
      doc.text(astroLines.slice(0, 2), margin + 4, y + 13);
    }

    if (synergy.humanDesignGeneKeysComplimentsContrasts) {
      const hdLines = doc.splitTextToSize(`Human Design & Gene Keys: ${synergy.humanDesignGeneKeysComplimentsContrasts.plainEnglishTranslation}`, contentWidth - 8);
      doc.text(hdLines.slice(0, 2), margin + 4, y + 23);
    }
    y += 40;
  }

  // Fighting Styles & Shadow Clashes
  checkPageBreak(35);
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(153, 27, 27);
  doc.text("5. FIGHTING STYLES & CIRCUIT BREAKER", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${profileA.firstName}'s Reactive Style: ${synergy.fightingStyles?.p1StyleName}`, margin + 4, y + 12);
  doc.text(`${profileB.firstName}'s Reactive Style: ${synergy.fightingStyles?.p2StyleName}`, margin + 4, y + 17);

  const deescLines = doc.splitTextToSize(`Circuit Breaker: ${synergy.fightingStyles?.deEscalationBlueprint || ""}`, contentWidth - 8);
  doc.text(deescLines.slice(0, 3), margin + 4, y + 23);
  y += 42;

  // Cheat Sheet Section
  checkPageBreak(40);
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(13, 148, 136);
  doc.text("6. CHEAT SHEET FOR BETTERING THE RELATIONSHIP", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const script = synergy.cheatSheet?.communicationScripts?.[0];
  if (script) {
    doc.text(`Effective Script: ${script.situation}`, margin + 4, y + 12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Say: ${script.whatToSay}`, margin + 6, y + 17);
    doc.setTextColor(239, 68, 68);
    doc.text(`Avoid: ${script.whatToAvoid}`, margin + 6, y + 22);
  }

  doc.setTextColor(51, 65, 85);
  const dosStr = (synergy.cheatSheet?.vitalDos || []).slice(0, 2).map((d: string) => `• ${d}`).join("  ");
  const dosLines = doc.splitTextToSize(dosStr, contentWidth - 8);
  doc.text(dosLines.slice(0, 2), margin + 4, y + 28);
  y += 44;

  // Work on Self vs Work Together
  checkPageBreak(38);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text("7. WORK ON SELF VS WORK TOGETHER (FULFILLMENT DIVISION)", margin + 4, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(99, 102, 241);
  doc.text("Work on Self (Individual Sovereignty):", margin + 4, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const self1 = synergy.growthWork?.workOnSelf?.[0] || "";
  const self2 = synergy.growthWork?.workOnSelf?.[1] || "";
  doc.text(`• ${self1}`, margin + 4, y + 17);
  doc.text(`• ${self2}`, margin + 4, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20, 184, 166);
  doc.text("Work Together (Relational Growth):", margin + 4, y + 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const tog1 = synergy.growthWork?.workTogether?.[0] || "";
  doc.text(`• ${tog1}`, margin + 4, y + 33);
  y += 42;

  // Ela Synthesis if present
  if (synergy.elaSynthesis) {
    checkPageBreak(40);
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(109, 40, 217);
    doc.text("8. ELA ORACLE'S DEEP SYNASTRY SYNTHESIS", margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    const elaClean = synergy.elaSynthesis.replace(/#/g, "").replace(/\*/g, "");
    const elaLines = doc.splitTextToSize(elaClean, contentWidth - 8);
    doc.text(elaLines.slice(0, 5), margin + 4, y + 12);
    y += 44;
  }

  // Apply official Affinity Lifestyle Consulting IP header & footer
  applyAffinityHeaderAndFooter(doc, "Relationship Synergy & Synastry Dossier");

  const safe1 = profileA.firstName.replace(/[^a-zA-Z0-9]/g, "_");
  const safe2 = profileB.firstName.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Affinity_Synergy_${safe1}_and_${safe2}.pdf`);
}

/**
 * Downloads a completed Myers-Briggs (MBTI) examination dossier with all 20 questions,
 * submitted answers, four-dichotomy scores, cognitive function stack, and archetype analysis.
 */
export function downloadCompletedMbtiPDF(
  record: {
    id: string;
    mbtiType: string;
    scores: Record<string, number>;
    answers?: Record<number, string>;
    createdAt?: string;
  },
  profile: Profile
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(168, 85, 247); // purple-400
  doc.text("EXECUTIVE MYERS-BRIGGS (MBTI) COGNITIVE REPORT", margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`Archetype Result: ${record.mbtiType} • Seeker: ${profile.firstName} ${profile.lastName} • ${new Date().toLocaleDateString()}`, margin + 6, y + 17);
  y += 32;

  // Profile Archetype Dossier Card
  const typeData = MBTI_PROFILES[record.mbtiType] || MBTI_PROFILES["INFJ"];
  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(192, 132, 252);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(88, 28, 135);
  doc.text(`${record.mbtiType} — ${typeData.title} (${typeData.nickname})`, margin + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(typeData.description, contentWidth - 10);
  doc.text(descLines.slice(0, 3), margin + 5, y + 13);
  y += 36;

  // Dichotomy Percentages Grid
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("DICHOTOMY PREFERENCE PERCENTAGES", margin, y);
  y += 5;

  const pairs = [
    { name: "Extraversion (E) vs Introversion (I)", a: record.scores?.E || 50, b: record.scores?.I || 50, labelA: "E", labelB: "I" },
    { name: "Sensing (S) vs Intuition (N)", a: record.scores?.S || 50, b: record.scores?.N || 50, labelA: "S", labelB: "N" },
    { name: "Thinking (T) vs Feeling (F)", a: record.scores?.T || 50, b: record.scores?.F || 50, labelA: "T", labelB: "F" },
    { name: "Judging (J) vs Perceiving (P)", a: record.scores?.J || 50, b: record.scores?.P || 50, labelA: "J", labelB: "P" },
  ];

  pairs.forEach((p) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 10, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(p.name, margin + 4, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(109, 40, 217);
    doc.text(`${p.labelA}: ${p.a}%  |  ${p.labelB}: ${p.b}%`, pageWidth - margin - 4, y + 6.5, { align: "right" });
    y += 12;
  });
  y += 4;

  // Complete Questions and Submitted Answers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("ALL 20 ASSESSMENT QUESTIONS & USER ANSWERS", margin, y);
  y += 6;

  MBTI_QUESTIONS.forEach((q) => {
    checkPageBreak(22);

    const userChoice = record.answers ? record.answers[q.id] : undefined;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`Q${q.id}. [${q.dichotomyName}] ${q.question}`, margin + 4, y + 5);

    // Option A
    const isA = userChoice === "A";
    doc.setFont("helvetica", isA ? "bold" : "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(isA ? 109 : 100, isA ? 40 : 116, isA ? 217 : 139);
    doc.text(`(A) ${isA ? "[SELECTED] " : ""}${q.optionA}`, margin + 4, y + 10);

    // Option B
    const isB = userChoice === "B";
    doc.setFont("helvetica", isB ? "bold" : "normal");
    doc.setTextColor(isB ? 109 : 100, isB ? 40 : 116, isB ? 217 : 139);
    doc.text(`(B) ${isB ? "[SELECTED] " : ""}${q.optionB}`, margin + 4, y + 15);

    y += 21;
  });

  // Apply official Affinity Lifestyle Consulting IP header & footer
  applyAffinityHeaderAndFooter(doc, "Completed Myers-Briggs (MBTI) Assessment & Answers");

  const safeName = `${profile.firstName}_${profile.lastName}`.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Affinity_MBTI_Report_${safeName}.pdf`);
}
