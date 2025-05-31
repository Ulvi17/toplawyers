# TopLawyers - Lawyer Database Web App

A modern, elegant lawyer database web application built with HTML, CSS (TailwindCSS), and JavaScript. This application connects directly to a Google Sheets database to display real lawyer and law firm information from Azerbaijan.

## 🚀 Features

### Core Functionality
- **Live Google Sheets Integration**: Fetches real lawyer data from Google Sheets in real-time
- **Searchable Lawyer Database**: Search by name, practice area, or firm type
- **Advanced Filtering System**:
  - Type (Legal Firm, Freelancer, International Legal Firm)
  - Experience levels (0-2, 3-5, 5-10, 10-15, 15+ years)
  - Languages (EN, AZ, RU with flag icons)
  - Practice Areas (Tax Law, IP Law, Corporate Law, Immigration Law, Energy Law, etc.)
- **Real Law Firm Profiles**: Actual firms including VLM Partners, Deloitte, Ernst & Young, GRATA International
- **Detailed Profile Modal**: Full lawyer profiles with contact information and specialties
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Data Source
- **Google Sheets Backend**: No database required - data is managed via Google Sheets
- **Automatic Updates**: Changes to the spreadsheet are reflected immediately
- **Real Azerbaijani Firms**: Features actual law firms and legal professionals
- **CSV Parsing**: Robust parsing of Google Sheets CSV export

### Additional Features
- **FAQ Section**: Accordion-style frequently asked questions
- **Lawyer Application Form**: Form for legal professionals to join the platform
- **Professional Footer**: Comprehensive site navigation and information
- **Budget Indicators**: Visual budget range display ($ to $$$$)
- **Language Support**: Multi-language lawyer profiles (English, Azerbaijani, Russian)
- **Loading States**: Professional loading and error handling

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional design with blue primary color scheme
- **TailwindCSS Styling**: Utility-first CSS framework for consistent design
- **Font Awesome Icons**: Professional iconography throughout the application
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Smooth Animations**: Hover effects and transitions for better user experience
- **Error Handling**: Graceful fallbacks for missing images and data

## 📊 Data Integration

### Google Sheets Structure
The application expects a Google Sheets with the following columns:
- **title**: Lawyer/Firm name
- **url**: Website URL
- **text**: Description
- **Type**: Legal Firm, Freelancer, or International Legal Firm
- **spheres**: Practice areas/specialties
- **Legal work**: Additional legal services
- **price**: Budget level ($ to $$$$)
- **Experience**: Years of experience (e.g., "5-10 years", "15+")
- **languages**: Language support (🇺🇸/🇬🇧; 🇦🇿; 🇷🇺)
- **logourl**: Logo image URL

### Current Data Source
The app is configured to use this Google Sheets: 
[TopLawyers Database](https://docs.google.com/spreadsheets/d/e/2PACX-1vSv7rv_TFjvRey0KGy46KoarQqHdRnsnrGesyQ_nknaPraV9Pl-7H0c9LNhc4ZBmBDiyJDHH2XQLeHa/pubhtml)

## 📁 Project Structure

```
toplawyers-website/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality with Google Sheets integration
└── README.md          # Project documentation
```

## 🔧 Setup & Installation

### Option 1: Direct Browser Access
1. Download or clone the repository
2. Open `index.html` directly in your web browser
3. The app will automatically fetch data from Google Sheets

### Option 2: Local Server (Recommended)
If you have Python installed:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -M SimpleHTTPServer 8000
```

Then visit `http://localhost:8000` in your browser.

### Option 3: Live Server (VS Code)
1. Install the Live Server extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 💻 Usage

### For Clients
1. **Browse**: The app loads real lawyer data automatically
2. **Search**: Use the search bar to find lawyers by name, specialty, or firm type
3. **Filter**: Apply filters to narrow down results:
   - Select lawyer type from dropdown
   - Choose experience level
   - Click language flags to filter by language
   - Select practice areas
4. **View Profiles**: Click on any lawyer card to view detailed profile
5. **Contact**: Use the contact information provided in profiles

### For Legal Professionals
1. Scroll to the bottom of the page
2. Fill out the "Submit Services" form
3. Provide your information and expertise
4. Submit application for review

### For Administrators
1. Update the Google Sheets directly
2. Changes appear immediately on the website
3. No code modifications required

## 🎯 Real Data

The application features actual law firms from Azerbaijan including:
- **VLM and Partners**: Migration, Energy, and Corporate Law
- **Deloitte Azerbaijan**: International legal services
- **Ernst & Young**: Global legal and tax services
- **GRATA International**: Multi-jurisdictional legal services
- **Remells Law Firm**: Comprehensive legal services
- **BDO Azerbaijan**: Business law and consulting
- **Notem Law**: Modern legal solutions

## 🔄 Data Management

### Updating Lawyer Data
1. **Edit Google Sheets**: Modify the source spreadsheet directly
2. **Add New Lawyers**: Add new rows with complete information
3. **Update Existing**: Modify any cell and changes reflect immediately
4. **No Coding Required**: All data management happens in Google Sheets

### Changing Data Source
To use a different Google Sheets:
1. Publish your sheet to the web as CSV
2. Update the `GOOGLE_SHEETS_URL` in `script.js`
3. Ensure your sheet follows the expected column structure

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Smartphones
- All screen sizes

## 🚀 Future Enhancements

- Advanced filtering by multiple practice areas
- Integration with multiple Google Sheets
- Caching for improved performance
- Admin dashboard for data management
- Email integration for contact forms
- Rating and review system
- Multi-language interface support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**TopLawyers** - Connecting clients with qualified legal professionals across Azerbaijan and beyond. 