# import os
# import pandas as pd
# from fpdf import FPDF
# from datetime import datetime

# class ReportGenerator:
#     """
#     Generates a comprehensive PDF intelligence report for a specific individual.
#     """
#     def __init__(self, all_datasets):
#         """
#         Initializes the report generator with pre-loaded pandas DataFrames.
#         """
#         self.persons_df = all_datasets.get('persons')
#         self.properties_df = all_datasets.get('properties')
#         if 'owner_person_id' in self.properties_df.columns:
#             self.properties_df = self.properties_df.rename(columns={'owner_person_id': 'person_id'})

#     def _safe_text(self, text):
#         """
#         Encodes text to be safely used in FPDF, handling potential special characters.
#         """
#         return str(text).encode('latin-1', 'replace').decode('latin-1')

#     def generate_pdf(self, person_id, risk_details, summary):
#         """
#         Generates and saves a PDF report for a given person_id using pre-analyzed data.
#         """
#         try:
#             person_info = self.persons_df[self.persons_df['person_id'] == person_id]
#             if person_info.empty:
#                 print(f"Error: Person with ID {person_id} not found for report generation.")
#                 return None
#             person_info = person_info.iloc[0]
            
#             pdf = FPDF()
#             pdf.add_page()
#             pdf.set_auto_page_break(auto=True, margin=15)
            
#             # --- Header ---
#             pdf.set_font("Helvetica", 'B', 20)
#             pdf.cell(0, 10, "Project Netra - Intelligence Report", 0, 1, 'C')
#             pdf.ln(10)

#             # --- Case Summary ---
#             pdf.set_font("Helvetica", 'B', 14)
#             pdf.cell(0, 10, self._safe_text(f"Subject: {person_info.get('full_name', 'N/A')} (ID: {person_id})"), 0, 1, 'L')
#             pdf.set_font("Helvetica", '', 12)
#             pdf.cell(0, 8, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 1, 'L')
#             pdf.ln(5)
#             pdf.set_font("Helvetica", 'B', 12)
#             pdf.cell(40, 10, "Overall Risk Score:")
#             pdf.set_text_color(255, 0, 0)
#             # --- FIX: Use .get() with a default value for safety ---
#             final_score = risk_details.get('final_risk_score', 0)
#             pdf.cell(20, 10, str(int(final_score)), 0, 1, 'L')
#             pdf.set_text_color(0, 0, 0)
#             pdf.ln(5)

#             # --- AI Generated Summary ---
#             self._add_section_title(pdf, "AI Generated Summary")
#             pdf.set_font("Helvetica", '', 11)
#             pdf.multi_cell(0, 7, self._safe_text(summary or "No AI summary available."), 0, 'L')
#             pdf.ln(10)

#             # --- Risk Factors Breakdown ---
#             self._add_section_title(pdf, "Risk Factor Analysis")
#             pdf.set_font("Helvetica", '', 11)
#             # --- FIX: Use .get() with a default value for safety ---
#             breakdown = risk_details.get('breakdown', {})
#             for _, details in breakdown.items():
#                 if details.get('score', 0) > 0:
#                     text = f"- {details.get('label', 'Unknown Factor')}: Score {details.get('score', 0)}"
#                     pdf.multi_cell(0, 7, self._safe_text(text), 0, 'L')
#             pdf.ln(10)

#             # --- Subject Details ---
#             self._add_section_title(pdf, "Subject Details")
#             # --- FIX: Handle potentially missing salary gracefully ---
#             salary = person_info.get('monthly_salary_inr', 0)
#             salary_text = f"INR {int(salary):,}/month" if pd.notna(salary) and salary > 0 else "N/A"
#             self._add_key_value(pdf, "Full Name", person_info.get('full_name', 'N/A'))
#             self._add_key_value(pdf, "Date of Birth", str(person_info.get('dob', 'N/A')))
#             self._add_key_value(pdf, "PAN Number", person_info.get('pan_number', 'N/A'))
#             self._add_key_value(pdf, "Address", person_info.get('address', 'N/A'))
#             self._add_key_value(pdf, "Declared Salary", salary_text)
#             pdf.ln(10)

#             # --- Associated Properties ---
#             self._add_section_title(pdf, "Associated Properties")
#             person_properties = self.properties_df[self.properties_df['person_id'] == person_id]
#             if not person_properties.empty:
#                 for _, prop in person_properties.iterrows():
#                     prop_text = (
#                         f"- Address: {prop.get('property_address', 'N/A')}\n"
#                         f"  Purchase Value: INR {int(prop.get('purchase_value_inr', 0)):,}"
#                     )
#                     pdf.set_font("Helvetica", '', 11)
#                     pdf.multi_cell(0, 7, self._safe_text(prop_text), 0, 'L')
#             else:
#                 pdf.set_font("Helvetica", 'I', 11)
#                 pdf.cell(0, 7, "No properties recorded.", 0, 1, 'L')
#             pdf.ln(10)

#             # --- Footer ---
#             pdf.set_y(-15)
#             pdf.set_font("Helvetica", 'I', 8)
#             pdf.cell(0, 10, f'Page {pdf.page_no()}', 0, 0, 'C')

#             # --- Save the PDF ---
#             output_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
#             os.makedirs(output_dir, exist_ok=True)
#             file_path = os.path.join(output_dir, f"report_{person_id}.pdf")
#             pdf.output(file_path)
#             print(f"Successfully generated report: {file_path}")
#             return file_path

#         except Exception as e:
#             # --- FIX: Add a detailed error log if PDF generation still fails ---
#             print(f"FATAL ERROR during PDF generation for {person_id}: {e}")
#             # This helps in debugging without crashing the entire server on one report.
#             return None

#     def _add_section_title(self, pdf, title):
#         pdf.set_font("Helvetica", 'B', 14)
#         pdf.set_fill_color(220, 220, 220)
#         pdf.cell(0, 10, self._safe_text(title), 0, 1, 'L', fill=True)
#         pdf.ln(4)

#     def _add_key_value(self, pdf, key, value):
#         pdf.set_font("Helvetica", 'B', 11)
#         pdf.cell(50, 7, self._safe_text(f"{key}:"))
#         pdf.set_font("Helvetica", '', 11)
#         pdf.multi_cell(0, 7, self._safe_text(value), 0, 'L')








import os
import pandas as pd
from fpdf import FPDF
from datetime import datetime

class ReportGenerator:
    """
    Generates a comprehensive PDF intelligence report for a specific individual.
    """
    def __init__(self, all_datasets):
        """
        Initializes the report generator with pre-loaded pandas DataFrames.
        """
        self.persons_df = all_datasets.get('persons')
        self.properties_df = all_datasets.get('properties')
        if 'owner_person_id' in self.properties_df.columns:
            self.properties_df = self.properties_df.rename(columns={'owner_person_id': 'person_id'})

    def _safe_text(self, text):
        """
        Encodes text to be safely used in FPDF, handling potential special characters.
        """
        if text is None:
            return "N/A"
        # Convert to string and handle encoding more safely
        text_str = str(text)
        # Remove problematic characters that might cause layout issues
        text_str = text_str.replace('\r\n', ' ').replace('\n', ' ').replace('\r', ' ')
        # Handle encoding with better fallback
        try:
            return text_str.encode('latin-1', 'replace').decode('latin-1')
        except:
            # If encoding fails, return ASCII-only version
            return ''.join(char if ord(char) < 128 else '?' for char in text_str)

    def generate_pdf(self, person_id, risk_details, summary):
        """
        Generates and saves a PDF report for a given person_id using pre-analyzed data.
        """
        try:
            person_info = self.persons_df[self.persons_df['person_id'] == person_id]
            if person_info.empty:
                print(f"Error: Person with ID {person_id} not found for report generation.")
                return None
            person_info = person_info.iloc[0]
            
            # Create PDF with explicit settings to avoid layout issues
            pdf = FPDF(orientation='P', unit='mm', format='A4')
            pdf.add_page()
            pdf.set_margins(left=20, top=20, right=20)
            pdf.set_auto_page_break(auto=True, margin=20)
            
            # Debug info
            effective_width = pdf.w - pdf.l_margin - pdf.r_margin
            print(f"DEBUG: PDF effective width: {effective_width}mm")
            
            # --- Header ---
            pdf.set_font("Arial", 'B', 18)
            pdf.ln(10)
            pdf.multi_cell(0, 10, "Project Netra - Intelligence Report", 0, 'C')
            pdf.ln(10)

            # --- Case Summary ---
            pdf.set_font("Arial", 'B', 14)
            subject_name = person_info.get('full_name', 'N/A')
            pdf.multi_cell(0, 8, self._safe_text(f"Subject: {subject_name} (ID: {person_id})"), 0, 'L')
            
            pdf.set_font("Arial", '', 12)
            pdf.multi_cell(0, 6, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 'L')
            pdf.ln(5)
            
            # --- Risk Score ---
            pdf.set_font("Arial", 'B', 12)
            pdf.multi_cell(0, 8, "Overall Risk Score:", 0, 'L')
            pdf.set_text_color(255, 0, 0)
            final_score = risk_details.get('final_risk_score', 0)
            pdf.set_font("Arial", 'B', 16)
            pdf.multi_cell(0, 10, str(int(final_score)), 0, 'L')
            pdf.set_text_color(0, 0, 0)
            pdf.ln(10)

            # --- AI Generated Summary ---
            self._add_section_title(pdf, "AI Generated Summary")
            pdf.set_font("Arial", '', 11)
            summary_text = summary or "No AI summary available."
            # Limit summary length to prevent issues
            if len(summary_text) > 800:
                summary_text = summary_text[:800] + "..."
            pdf.multi_cell(0, 6, self._safe_text(summary_text), 0, 'L')
            pdf.ln(10)

            # --- Risk Factors Breakdown ---
            self._add_section_title(pdf, "Risk Factor Analysis")
            pdf.set_font("Arial", '', 11)
            breakdown = risk_details.get('breakdown', {})
            
            if breakdown:
                for factor_key, details in breakdown.items():
                    score = details.get('score', 0)
                    if score > 0:
                        label = details.get('label', 'Unknown Factor')
                        # Keep text simple and short
                        risk_text = f"• {label}: {score}"
                        pdf.multi_cell(0, 6, self._safe_text(risk_text), 0, 'L')
                        pdf.ln(2)
            else:
                pdf.multi_cell(0, 6, "No significant risk factors identified.", 0, 'L')
            pdf.ln(10)

            # --- Subject Details ---
            self._add_section_title(pdf, "Subject Details")
            pdf.set_font("Arial", '', 11)
            
            # Handle salary safely
            salary = person_info.get('monthly_salary_inr', 0)
            salary_text = f"INR {int(salary):,}/month" if pd.notna(salary) and salary > 0 else "N/A"
            
            # Use simple multi_cell approach for all details
            details = [
                f"Full Name: {person_info.get('full_name', 'N/A')}",
                f"Date of Birth: {person_info.get('dob', 'N/A')}",
                f"PAN Number: {person_info.get('pan_number', 'N/A')}",
                f"Declared Salary: {salary_text}",
                f"Address: {person_info.get('address', 'N/A')}"
            ]
            
            for detail in details:
                pdf.multi_cell(0, 6, self._safe_text(detail), 0, 'L')
                pdf.ln(2)
            pdf.ln(10)

            # --- Associated Properties ---
            self._add_section_title(pdf, "Associated Properties")
            person_properties = self.properties_df[self.properties_df['person_id'] == person_id]
            
            if not person_properties.empty:
                pdf.set_font("Arial", '', 11)
                for i, (_, prop) in enumerate(person_properties.iterrows(), 1):
                    address = str(prop.get('property_address', 'N/A'))
                    # Truncate long addresses
                    if len(address) > 80:
                        address = address[:80] + "..."
                    
                    purchase_value = prop.get('purchase_value_inr', 0)
                    value_text = f"INR {int(purchase_value):,}" if pd.notna(purchase_value) and purchase_value > 0 else "N/A"
                    
                    property_info = f"Property {i}: {address} (Value: {value_text})"
                    pdf.multi_cell(0, 6, self._safe_text(property_info), 0, 'L')
                    pdf.ln(3)
            else:
                pdf.set_font("Arial", 'I', 11)
                pdf.multi_cell(0, 6, "No properties recorded.", 0, 'L')

            # --- Footer ---
            pdf.set_y(-25)
            pdf.set_font("Arial", 'I', 8)
            pdf.multi_cell(0, 10, f'Page {pdf.page_no()}', 0, 'C')

            # --- Save the PDF ---
            output_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
            os.makedirs(output_dir, exist_ok=True)
            file_path = os.path.join(output_dir, f"report_{person_id}.pdf")
            pdf.output(file_path)
            print(f"Successfully generated report: {file_path}")
            return file_path

        except Exception as e:
            print(f"FATAL ERROR during PDF generation for {person_id}: {e}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
            return None

    def _add_section_title(self, pdf, title):
        """
        Adds a section title with consistent formatting
        """
        pdf.set_font("Arial", 'B', 14)
        pdf.set_fill_color(230, 230, 230)
        pdf.multi_cell(0, 10, self._safe_text(title), 0, 'L', fill=True)
        pdf.ln(5)