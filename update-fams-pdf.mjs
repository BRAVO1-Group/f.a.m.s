import fs from 'node:fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const source = String.raw`C:\Users\Am Fic\OneDrive\Desktop\FAMS_Complete_Academic_Project_Report_MUBS_Format.pdf`;
const output = String.raw`C:\Users\Am Fic\OneDrive\Desktop\FAMS_Complete_Academic_Project_Report_MUBS_Format_UPDATED.pdf`;

const captures = [
  {
    title: 'Figure 6: Attachment Office Administrator Cohort Monitoring Console',
    caption: 'Current interface: Assigned Student Interns',
    image: String.raw`C:\Users\Am Fic\OneDrive\Desktop\F.A.M.S V2\f.a.m.s\public\screenshots\students.png`,
  },
  {
    title: 'Figure 7: Student Digital Logbook',
    caption: 'Current interface: Daily activity entries and submission status',
    image: String.raw`C:\Users\Am Fic\OneDrive\Desktop\F.A.M.S V2\f.a.m.s\public\screenshots\logbook.png`,
  },
  {
    title: 'Figure 9: Geolocation Attendance & Shift Clock-In/Out',
    caption: 'Current interface: Attendance history and clock-in/out',
    image: String.raw`C:\Users\Am Fic\OneDrive\Desktop\F.A.M.S V2\f.a.m.s\public\screenshots\attendance.png`,
  },
];

const pdfBytes = fs.readFileSync(source);
const pdf = await PDFDocument.load(pdfBytes);
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const pageSizes = captures.map((_, i) => pdf.getPage(28 + i).getSize());

for (let i = 0; i < captures.length; i += 1) {
  const capture = captures[i];
  const pageIndex = 28 + i;
  const pngBytes = fs.readFileSync(capture.image);
  const png = await pdf.embedPng(pngBytes);
  const { width, height } = pageSizes[i];
  const page = pdf.getPage(pageIndex);
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 0, y: height - 82, width, height: 82, color: rgb(0.035, 0.12, 0.12) });
  page.drawText('InternTrack Pro - Live Interface Capture', {
    x: 36,
    y: height - 34,
    size: 10,
    font,
    color: rgb(0.69, 0.82, 0.79),
  });
  page.drawText(capture.title, {
    x: 36,
    y: height - 59,
    size: 14,
    font: bold,
    color: rgb(1, 1, 1),
  });

  const margin = 36;
  const top = height - 104;
  const bottom = 54;
  const availableWidth = width - margin * 2;
  const availableHeight = top - bottom;
  const scale = Math.min(availableWidth / png.width, availableHeight / png.height);
  const drawWidth = png.width * scale;
  const drawHeight = png.height * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = bottom + (availableHeight - drawHeight) / 2;

  page.drawRectangle({
    x: drawX - 3,
    y: drawY - 3,
    width: drawWidth + 6,
    height: drawHeight + 6,
    borderWidth: 1,
    borderColor: rgb(0.75, 0.78, 0.78),
  });
  page.drawImage(png, { x: drawX, y: drawY, width: drawWidth, height: drawHeight });
  page.drawText(capture.caption, {
    x: margin,
    y: 32,
    size: 8,
    font,
    color: rgb(0.25, 0.28, 0.28),
  });
}

fs.writeFileSync(output, await pdf.save());
console.log(output);
