import { jsPDF } from "jspdf";
import { Job, RiskItem, User, SelfCheckItem } from "../types";

// Base64 string provided by user. We strip whitespace to ensure validity.
const AJAB_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkkAAACKCAYAAAC+Y94HAAAACXBIWXMAAC4jAAAuIwF4pT92AAAObElEQVR4nO3dT27bSBbHcfbAe/sGNsA1YS+4t+cE0Q3inKDdJ7BzgigniHOCkU9gay8gMrQWRrqBdYIMSnn0kLQokWKxWK/4/QBCupHumGas0u891p+/fv/+HcGuOEnPoii6GvhtXS0Xs5UH19GbOElvPL/Et+ViNvfgOgZDwc9E13r5mYuT1IzHZ86/2+GZLxezt5C+6xMPrsF7udBzIS8jP9hdD/0e7fA1iqIH767KrWfPr29a+jlGQxJ68kVR/sPY/PMp97Sgr5+5MeO0G3GS5r/OVH5dyWsuQflFy/dDSMrJhaGbXCDijQUMnIShrFC6IgABtWSfn4XPUQlSrxKazOvF1672oENSnKQXEoiy17kHlwWgR1Is5ceFS/4+AOsu5fU5+vO+20RRNDGByfzqy2O7wYWkOElHURSNCEUAMjJn5ZZQBPTmVAKTef2Ik/RJwtJjnxc1iJCUC0YjWuQAomIwGlEwAd75ZF5xkpr5ZCYojftYDBRsSJJHaXcyCBKMAGSP0m5lbCAYAf4zn99/m1ecpD/NgiCXYSm4kCQTLB+YcA0gI0XTQzb/AYBK28dxLsPSv0L5OTGP1OIkncuyawISgG04ipPUtOr/S0ACgmHey/M4STvfZkZ9J4nOEYAyOkdA8MxjuHuZc3zb1RYCajtJUiFO6BwByJPqck5AAgbBrEb91VVXSWUnKU7SO6kSmZANYEu6yo9MyAYG6V7GgJHNPZZUdZLMypQ4Sc1GU98ISAAyskz4mYAEDJp5qvQi23tYoSYkSUJc8WgNQEYeu89liTAAXNoMSipCkjxee6Z7BCAjg+CcHbIBlJzaCkrehyRZvvvNg0sB4Ik4Sc2GkL8onABUsBKUvA5JEpBYoQLgnQSkH9wRAAe0DkrehiQCEoAyAhKAhkxQepQjiRrzMiQRkACUEZAAHMnMW5wc8796F5IISADKCEgAWro+ZsNJr0KSDIQEJADvZD7BmDsCoKX7pvOTvAlJcuFUigDeyTyCCavYAFjy2OSP8SIk5QZCAMjjmBEANl3KU6tafOkkMRACKJBNZD9xVwBYVntuUu8hKU7SEQMhgDxz3EiTgQwAGjiv203qNSTJY7ZGzwcBDMKYeUgAOlSrCOu7k3THQAggTw6zprsMoEvnMtbs1VtIknb6PT8CAEroLgNw4eAjtz47Scw3AFAg8wRYxAHAhdGhr9FLSJIuEptGAiijeALgyqksHqvUVyeJgRBAgQxWdJEAuLR3XtKJ678KWdF2sMUFYHDu+CvHgE0Vf+vXHlzDsfwKSRKQWNEG4J08gtc80AKtLBezgyutfCbv4Rt5UqSpI3y57zf7CEmhVYsm/b/Ia7VczFZdf0FZtvjc9dcBHAptXHgtjQtzF180TtLfLr4OUCaffWZl6qPslv9Ny00yn6nLxexl1+85DUmSNPemNiXWkpYny8XsLYDvB+hbCI/gN/IhMXZRLAG+Wi5m4zhJzXvgP0r+kq6koPnAdSdJ+0C4DUfLxYx9XABL4iS9Uj5heyM7hI8pmoA/lovZJE7Sf5R0lM6qfsP16rbaJ+966LtJmwQkwDrN48JUxoUHAhJQZDpK0lzw3VXV9TnrJCl+1GaqxFHV80oArWntMP8jHwIAqo0VdJO86CRpnLlvAlLlhC4A7UjxpPFR2xcCElDLRPNtIiRVywKSk1UpwEBpLJ6+8NgdqEfJIobKx20uQ5KmljoBCXBDW0giIAHN+b5RZuXejU5Ckqxe0bSB5C0BCXBCU/H0nYAEDIurTpKmavHJLF304DqAoCkrntacOQkMDyGpaKN8OTKgiabi6ZYl/sDRKlePeWJTdRmEpCI2gwPc0TIuTFnhCrTi+/Y/ldNrOg9Jcs6YhpZ6tmsuADe0hCQeswFHkgyglotOkpYbxDlsgCOKiqc1XSSgFQ1TWPrrJCkKSaxaAdxRUzx5cA2ASrJZ7GcF1165l5OLkHTt4Gu0taFaBJyieALCp+X9U9lJ6vTstjhJteyBQrUIuKWleGK/NKChOEnPJCBpeJ9H+5okXXeStFSLdJEARyiegHDFSXornZlPSr7Jp32/2WkniZAEYAfGBaBE+Sowc+0X8qu2A6v3FkOdhSRpt/m+N4LxquQAPiAUhCTgo2fuSS/2hqQuH7cxEAIooHgC4JGfh7b+6TIkaZl3QEgC3KF4AuCLgxtID76TxGG2gFNM2gbgg2md1audhCTZQErD5K2pB9cADImW4olOEhC2uzrfXVedJHbTBVCgqHjauyQYgHo/6+6BNvSQRLUIuMO4AKBvm7pdpKjDkKRh3gG76QJusZgDQN9umxxmbz0kxUl6peR0bx61AW5p6CStKZ6AYH1vuliri04SLXUABYqKJ8YFIExm77Paj9kyQw5JdJIAdyieAPRlfewY1EVI0nCo3WuTZ5IAWqN4AtAHM1F7dOxnvtWQpOiAPqpFwC2KJwB9uGkzz9B2J4lqEUABxROAHj3ImZFHGWRIYjddwCmKJwB9MV3slSweacxaSJKkdq3gx4DddAG3KJ4A9MmsrP0VJ+lt02uw2UmipQ6ggOIJgEd+NA1KhCQAXWJcAOATE5Qe617P0EISu+kCbjEfCYBvPtftKFkJSdJSv1TwY0C1CLilpXhaeXAdANyp9ejNVieJgysBFFA8AfDc+NCqN1shiZY6gDItxRPjAjBMZtXbZN8+SieWbouakBQnqQeX0drRG2MBDmkZF8xmc40PvgQQhHMzBkRRtHMMaB2S4iS9kC+igYalyEAotIQkDY8EAXTn7zhJJ7v2SrPxuE3LQAjAEWXFEwCMd90BGyFJy7wDAO5QPAHQ5HLXajc6SQC6QPEEQJuH8vW2CkmydO6UHwMAJRRPALQ5j5O0UOC17SQxEAIooHgCoFjhkVvbkERLHUAZxRMArT7l901quwUAS+oBlFE8AQ0tF7O/Qrlnsrr1SsaCkcLOsrnm7SG4R4ekOEmpFgHsQvEEDJichbjK7WZtNmq8V3RH3kNSm8dthCQABRRPAPKWi9nbcjEzq8b+HUXRRsnNeR/H2oQkWuoAyghJAD6Q3ay15IbT7ODbo0KSotO9AbhF8QRgJwlKX5XcnW3Bd2wniWoRQAHFE4Aaxkoeu5nJ54QkYMA+HObYEuMCgL3MHKVsUrTnjn/cxmAI7DfQCcyMCwDq0BCSjuskyf4HtNQBlBGSABy0XMzmCu7SeXRkJ4mBEDjsYkj3iOIJQENTDTeMkAR0Q0NIslnNMS4AaOJNw90iJAHd0PA+sTlIMS4AaML7R26mQ94oJElL/by7SwKCcaXgG1lZ/LMISQBC0ywksVEccJjs1Or9gY5yvlJrFE8AAvXWNCRRLQKH3Sq4R68W/yyKJwBNed9tN6vwCEmARbLrtIaQxKM2AH0603D3a4ckLY8QgJ7dKXmfsLINQJ80zNtstLqNgRDYQ7pId0rukZUjSSieADSladxoEpKYdwDs96LljS+ncdtA8QSgKQ15YrvZ5UmD/+G6u2sB9JIO0ljRjtNM2gbQJw3zNrdqhaSBHtYJHCRt40dlR3JMLP5ZFE8AaouT9EHJliHbbnvdThLVIpAjewOZN/tnhffFSkiieALQhBSV90pu2vZEgrohicEQgyfB6EaKhk9K78fa4gncFE8AapGAZGsupAvbcfJgSJL5FpzuDef2dCreLH7Qf5D7umeyTDV7hbCrtM1HbRRPAA6Kk/ROOu9qVsJmi1vqdJK0DIRTZSm1jQulj3maeq767+Mk9faiPTe2cXmKiqe1zBkbCi2PMhA4KTZH8tJWYE6zfwgpJD1YXNbsNfnhG0JIgl1TW+e1KRoXHpeL2YMH1+FEnKSEJKXiJA3h8yuUJ0/vfxd1QpKWeQedPX4BAmGzo6IlJDEuQAtWivrjfVrC3s0kFZ3u/bpczN48uA7AV2bCts2QpKV4GsojeAB2FBa3HNpxm2oRCIO1R06Kiqc1xROAhgqLW0IJSVSLQDXbXSTGBQChKixuoZMEhM/2obuMCwBC9GFxS2VIko2fNLTUN13umQMoZ970NvdGiugkAQjUh2kJ+zpJVIuAbhvbB0kqKp4iiicADUx3bSMUQkiiWgR2e7C4L1JG0+ayAFDXzsUtdJKAMJmqyMru2iWMCwBC81S1GfXOkCQtdS1nrNBJAoo2He5jRIcZQEg2+xa3VHWStGwUxz4oQJF5w9908b5QVjzRSQJQx95pCVUhiWoR0OmuwwnLmoon23OxAITn6dC0hKqQpOUMGapF4P++WN40soz5SABC8Vpn9e+HkCQnzGtBJwn4o+uAFCkqnhgXAOyz3R6lzrSEXZ0kLS119kEB/ug8ICkrnhgXAFTJ5m3WGid2hST2QQH0cNFBipQVT3SSAOzSKCAZJ/l/iZP0LIqiSyW3loEQQ9b4zd6SluLp1YNrAOCfo8bMcieJljrgPxMErlwFJIonAMqtjy0qT0r/rqalTkjCQH1fLma2T/U/hOIJgFZmas7o2L3jyiFJy2DIPigYmrWsxuijU6KpeKKTBCDzdbmY7TyTra73kBQn6YWW072pFjEw32VX2L52l9dSPG0ongBkeyDZmJKQ7ySxPxLgl2nHO2gfpKx4YlwAhs1Mzh637R7laQ1JdJIQsj4frZUxLgDQ4Oehc9iOkQ9J7IMC9GsqVdDEo78HOswAfDaVcNTJ+38bkpSd7s0mkgiNqYAePQ3/rHgF4KMnKSo7HTezThItdcAtM7HwUcJRXxOy91JWPL36eh8BWLORcXPsapEGIQlwJwtGEyWrsBgXAPTNBKOJjJvOpyJoDEnMO4AWa/l5fZE3uLZOB+MCgD6sc+Nmr3M0T+R0by0tdfZBga9Ml2glHQ3z5p4H8PiHThIAF6byHt6Onz59zp9QLQIHmQCUBZ6VvN7kDf3W5z5GXVFYPBGSAH/lF1xln+Pm15XXjY8oiv4HFegWzyVhKwUAAAAASUVORK5CYII=".replace(/\s/g, '');

const addHeader = (doc: jsPDF, title: string, user: User, margin: number, pageWidth: number) => {
    let y = 20;

    // 1. Image Logo
    const logoWidth = 60; 
    const logoHeight = 15; 
    
    try {
        doc.addImage(AJAB_LOGO_BASE64, 'PNG', margin, y, logoWidth, logoHeight);
    } catch (err) {
        console.error("Logo Error:", err);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("AJAB", margin, y + 10);
    }

    // Title Text Block
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin + 70, y + 5);

    // Version
    doc.setFontSize(10);
    doc.text("Utgåva\n2", pageWidth - margin, y + 5, { align: 'right' });

    y += 25;

    // Divider Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 6;

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Godkänd av:", margin + 40, y);
    doc.text("Platschef", margin + 40, y + 5);

    doc.text("Giltig fr o m:", pageWidth - margin - 30, y);
    doc.text("2025-06-02", pageWidth - margin - 30, y + 5);

    y += 10;
    doc.line(margin, y, pageWidth - margin, y);
    
    return y + 15; // Return new Y position
}

const addJobDetails = (doc: jsPDF, job: Job, user: User, margin: number, pageWidth: number, startY: number) => {
    const boxHeight = 35;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, startY, pageWidth - (margin * 2), boxHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, startY, pageWidth - (margin * 2), boxHeight, 'S');
    
    const startBoxY = startY + 8;
    const boxLeftX = margin + 5;
    const boxRightX = margin + 100;

    let y = startBoxY;
    
    // Left side
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Kund / Arbetsplats:", boxLeftX, y);
    doc.setFont("helvetica", "normal");
    doc.text(job.customerName, boxLeftX + 35, y);
    y += 5;
    doc.text(job.address, boxLeftX + 35, y);
    
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Beskrivning:", boxLeftX, y);
    doc.setFont("helvetica", "normal");
    const descPreview = job.description.length > 50 ? job.description.substring(0, 47) + "..." : job.description;
    doc.text(descPreview, boxLeftX + 35, y);

    // Right side
    y = startBoxY;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Datum:", boxRightX, y);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toISOString().split('T')[0], boxRightX + 30, y);

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Utfärdad av:", boxRightX, y);
    doc.setFont("helvetica", "normal");
    doc.text(user.email.split('@')[0], boxRightX + 30, y);

    return startY + boxHeight + 15; // Return new Y
}

export const generateRiskPDF = (job: Job, user: User, risks: RiskItem[], notes: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  let y = addHeader(doc, "Riskbedömning installation, montage och\nservicearbeten", user, margin, pageWidth);
  
  // Job Box
  y = addJobDetails(doc, job, user, margin, pageWidth, y);

  // --- RISK LIST ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(200, 200, 200);
  doc.rect(margin, y - 6, pageWidth - (margin * 2), 8, 'F'); 
  doc.setTextColor(0,0,0);
  doc.text("Resultatet av riskbedömningen", pageWidth / 2, y - 1, { align: 'center' });
  y += 10;

  const activeRisks = risks.filter(r => r.checked);

  if (activeRisks.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.text("Inga risker markerade.", margin, y);
    y += 10;
  }

  activeRisks.forEach((risk) => {
    if (y > 270) { doc.addPage(); y = 20; }

    const riskColor: [number, number, number] = 
      risk.riskLevel === 'H' ? [220, 38, 38] : 
      risk.riskLevel === 'M' ? [217, 119, 6] : 
      [22, 163, 74];
    
    const riskLabel = risk.riskLevel === 'H' ? "HÖG" : risk.riskLevel === 'M' ? "MEDEL" : "LÅG";

    doc.setFontSize(9);
    
    doc.setTextColor(...riskColor);
    doc.setFont("helvetica", "bold");
    doc.text(riskLabel, margin, y);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(risk.category, margin + 20, y);
    
    y += 5;
    const hazardLines = doc.splitTextToSize(risk.hazard, pageWidth - margin * 2 - 20);
    doc.text(hazardLines, margin + 20, y);
    y += (hazardLines.length * 4);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const measureLines = doc.splitTextToSize(`Åtgärd: ${risk.measure}`, pageWidth - margin * 2 - 20);
    doc.text(measureLines, margin + 20, y);
    y += (measureLines.length * 4) + 4; 

    doc.setDrawColor(240, 240, 240);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
    y += 4;
  });

  // Notes
  if (notes) {
    if (y > 250) { doc.addPage(); y = 20; }
    y += 5;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Övriga noteringar / Kommentarer", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const noteLines = doc.splitTextToSize(notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, y);
    y += (noteLines.length * 5);
  }

  // Footer
  if (y > 240) { doc.addPage(); y = 20; }
  y = Math.max(y + 10, 250); 

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0,0,0);
  doc.text("Ort & Datum:", margin, y);
  doc.line(margin, y + 8, margin + 60, y + 8);
  
  doc.text("Signatur Montör:", margin + 80, y);
  doc.line(margin + 80, y + 8, pageWidth - margin, y + 8);

  y += 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Genererat via Portmontage AJAB App.", pageWidth / 2, y, { align: 'center' });

  doc.save(`Riskanalys_${job.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};

export const generateSelfCheckPDF = (job: Job, user: User, items: SelfCheckItem[], generalComment: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
  
    // Header
    let y = addHeader(doc, "Egenkontroll & Arbetsplatskontroll", user, margin, pageWidth);
    
    // Job Box
    y = addJobDetails(doc, job, user, margin, pageWidth, y);

    // --- SELF CHECK ITEMS ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(200, 200, 200);
    doc.rect(margin, y - 6, pageWidth - (margin * 2), 8, 'F'); 
    doc.setTextColor(0,0,0);
    doc.text("Kontrollpunkter", pageWidth / 2, y - 1, { align: 'center' });
    y += 10;

    items.forEach((item) => {
        if (y > 260) { doc.addPage(); y = 20; }

        doc.setFontSize(10);
        
        // Status Icon/Text
        if (item.status === 'OK') {
            doc.setTextColor(22, 163, 74); // Green
            doc.setFont("helvetica", "bold");
            doc.text("[ OK ]", margin, y);
        } else {
            doc.setTextColor(220, 38, 38); // Red
            doc.setFont("helvetica", "bold");
            doc.text("[EJ OK]", margin, y);
        }

        // Label
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        // Wrap text
        const labelLines = doc.splitTextToSize(item.label, pageWidth - margin * 2 - 30);
        doc.text(labelLines, margin + 25, y);
        
        let extraHeight = labelLines.length * 5;

        // Comment if Not OK
        if (item.status === 'EJ_OK' && item.comment) {
            y += extraHeight;
            doc.setTextColor(220, 38, 38);
            doc.setFont("helvetica", "italic");
            doc.text(`Avvikelse: ${item.comment}`, margin + 25, y);
            extraHeight += 5;
        }

        y += Math.max(8, extraHeight + 3);
        
        // Separator
        doc.setDrawColor(240, 240, 240);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
    });

    // General Comments
    if (generalComment) {
        if (y > 250) { doc.addPage(); y = 20; }
        y += 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Övriga kommentarer", margin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        const commentLines = doc.splitTextToSize(generalComment, pageWidth - margin * 2);
        doc.text(commentLines, margin, y);
        y += (commentLines.length * 5);
    }

    // Footer
    if (y > 240) { doc.addPage(); y = 20; }
    y = Math.max(y + 10, 250); 

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0,0,0);
    doc.text("Ort & Datum:", margin, y);
    doc.line(margin, y + 8, margin + 60, y + 8);
    
    doc.text("Signatur Montör:", margin + 80, y);
    doc.line(margin + 80, y + 8, pageWidth - margin, y + 8);

    y += 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Genererat via Portmontage AJAB App.", pageWidth / 2, y, { align: 'center' });

    doc.save(`Egenkontroll_${job.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}