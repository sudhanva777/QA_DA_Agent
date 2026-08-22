import os
import re
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

OUTPUTS_DIR = Path("outputs").resolve()


def _sanitize_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("&", "&").replace("<", "<").replace(">", ">")
    return text


def _sanitize_filename(name: str) -> str:
    name = re.sub(r"[^\w\s\-\.]", "", name)
    name = re.sub(r"\s+", "_", name)
    return name[:100]


def _resolve_chart_path(chart_url: Optional[str]) -> Optional[Path]:
    if not chart_url:
        return None
    try:
        rel_path = chart_url.lstrip("/")
        if rel_path.startswith("outputs/"):
            rel_path = rel_path[len("outputs/"):]
        chart_path = OUTPUTS_DIR / rel_path
        chart_path = chart_path.resolve()
        if OUTPUTS_DIR in chart_path.parents or chart_path == OUTPUTS_DIR:
            if chart_path.exists() and chart_path.suffix.lower() in (".png", ".jpg", ".jpeg"):
                return chart_path
    except Exception:
        pass
    return None


def _format_table_data(table: Dict[str, Any]) -> List[List[str]]:
    if not table:
        return []
    columns = table.get("columns", [])
    rows = table.get("rows", [])
    if not columns or not rows:
        return []
    header = [str(c) for c in columns]
    data = [header]
    for row in rows:
        data.append([str(row.get(c, "")) if row.get(c) is not None else "" for c in columns])
    return data


def _create_table(table_data: List[List[str]], page_width: float) -> Optional[Table]:
    if not table_data or len(table_data) < 1:
        return None
    col_count = len(table_data[0])
    if col_count == 0:
        return None
    available_width = page_width - 40
    col_width = min(available_width / col_count, 120)
    table_obj = Table(table_data, colWidths=[col_width] * col_count, repeatRows=1)
    style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E3A5F")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
        ("TOPPADDING", (0, 0), (-1, 0), 6),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ("TOPPADDING", (0, 1), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ])
    table_obj.setStyle(style)
    return table_obj


def _build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="ReportTitle",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1E3A5F"),
        spaceAfter=6,
        alignment=TA_CENTER,
    ))
    styles.add(ParagraphStyle(
        name="SectionHeader",
        parent=styles["Heading2"],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1E3A5F"),
        spaceBefore=14,
        spaceAfter=6,
        borderWidth=0,
        borderPadding=0,
    ))
    styles.add(ParagraphStyle(
        name="BodyText2",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name="CodeText",
        parent=styles["Code"],
        fontSize=7,
        leading=10,
        textColor=colors.HexColor("#1E293B"),
        backColor=colors.HexColor("#F1F5F9"),
        borderPadding=(4, 4, 4, 4),
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        name="SmallText",
        parent=styles["Normal"],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=2,
    ))
    return styles


def generate_analysis_pdf(
    analysis_result: Dict[str, Any],
    output_path: Optional[str] = None,
) -> str:
    styles = _build_styles()
    story = []

    title = Paragraph("AI Data Analysis Report", styles["ReportTitle"])
    story.append(title)

    dataset_id = analysis_result.get("dataset_id", "Unknown")
    timestamp = analysis_result.get("timestamp")
    if timestamp:
        try:
            dt = datetime.fromtimestamp(timestamp)
            ts_str = dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            ts_str = str(timestamp)
    else:
        ts_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    meta_style = styles["SmallText"]
    story.append(Paragraph(f"Dataset: {_sanitize_text(dataset_id)}", meta_style))
    story.append(Paragraph(f"Generated: {ts_str}", meta_style))
    latency = analysis_result.get("latency_ms")
    if latency is not None:
        story.append(Paragraph(f"Analysis Latency: {latency:.1f} ms", meta_style))
    story.append(Spacer(1, 12))

    question = analysis_result.get("question", "")
    if question:
        story.append(Paragraph("Question", styles["SectionHeader"]))
        story.append(Paragraph(_sanitize_text(question), styles["BodyText2"]))
        story.append(Spacer(1, 6))

    answer = analysis_result.get("answer", "")
    if answer:
        story.append(Paragraph("Answer", styles["SectionHeader"]))
        story.append(Paragraph(_sanitize_text(answer), styles["BodyText2"]))
        story.append(Spacer(1, 6))

    explanation = analysis_result.get("explanation", "")
    if explanation and explanation != answer:
        story.append(Paragraph("Explanation", styles["SectionHeader"]))
        story.append(Paragraph(_sanitize_text(explanation), styles["BodyText2"]))
        story.append(Spacer(1, 6))

    table = analysis_result.get("table")
    if table:
        story.append(Paragraph("Result Table", styles["SectionHeader"]))
        table_data = _format_table_data(table)
        if table_data:
            page_width = A4[0]
            if len(table_data[0]) > 6:
                page_width = landscape(A4)[0]
            tbl = _create_table(table_data, page_width)
            if tbl:
                story.append(tbl)
                row_count = len(table_data) - 1
                if row_count > 50:
                    story.append(Paragraph(
                        f"Note: Table truncated to first 50 rows of {row_count} total rows.",
                        styles["SmallText"]
                    ))
                story.append(Spacer(1, 8))

    chart_url = analysis_result.get("chart_url")
    chart_path = _resolve_chart_path(chart_url)
    if chart_path:
        story.append(Paragraph("Chart", styles["SectionHeader"]))
        try:
            img = Image(str(chart_path))
            max_width = A4[0] - 80
            max_height = 300
            img_width, img_height = img.imageWidth, img.imageHeight
            scale = min(max_width / img_width, max_height / img_height, 1.0)
            img.drawWidth = img_width * scale
            img.drawHeight = img_height * scale
            story.append(img)
        except Exception:
            story.append(Paragraph("Chart unavailable.", styles["SmallText"]))
    else:
        story.append(Paragraph("Chart", styles["SectionHeader"]))
        story.append(Paragraph("Chart unavailable.", styles["SmallText"]))
    story.append(Spacer(1, 8))

    generated_code = analysis_result.get("generated_code", "")
    if generated_code:
        story.append(Paragraph("Generated Python Code", styles["SectionHeader"]))
        code_lines = generated_code.split("\n")
        for line in code_lines:
            story.append(Paragraph(_sanitize_text(line), styles["CodeText"]))
        story.append(Spacer(1, 8))

    analysis_plan = analysis_result.get("analysis_plan")
    if analysis_plan:
        story.append(Paragraph("Analysis Plan", styles["SectionHeader"]))
        if isinstance(analysis_plan, dict):
            for key, value in analysis_plan.items():
                story.append(Paragraph(f"<b>{_sanitize_text(str(key))}:</b> {_sanitize_text(str(value))}", styles["BodyText2"]))
        else:
            story.append(Paragraph(_sanitize_text(str(analysis_plan)), styles["BodyText2"]))
        story.append(Spacer(1, 8))

    if output_path:
        doc = BaseDocTemplate(
            output_path,
            pagesize=A4,
            leftMargin=40,
            rightMargin=40,
            topMargin=50,
            bottomMargin=50,
        )
    else:
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp.close()
        output_path = tmp.name
        doc = BaseDocTemplate(
            output_path,
            pagesize=A4,
            leftMargin=40,
            rightMargin=40,
            topMargin=50,
            bottomMargin=50,
        )

    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    template = PageTemplate(id="main", frames=[frame])
    doc.addPageTemplates([template])
    doc.build(story)

    return output_path