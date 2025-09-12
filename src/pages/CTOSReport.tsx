import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeLocalStorage } from '@/utils/storage';

interface CTOSData {
  name: string;
  newId: string;
  oldId: string;
  dateOfBirth: string;
  address1: string;
  address2: string;
  score: string;
}

const CTOSReport = () => {
  const navigate = useNavigate();
  const [ctosData, setCTOSData] = useState<CTOSData | null>(null);

  useEffect(() => {
    // Get CTOS data from localStorage
    const data = safeLocalStorage.getJSON<CTOSData>('ctosData');
    if (!data) {
      navigate('/');
      return;
    }
    
    setCTOSData(data);
  }, [navigate]);

  useEffect(() => {
    // Handle Escape key press
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const getScorePosition = (score: number) => {
    // Map score to degrees (0-180 degrees for semicircle)
    const percentage = (score - 300) / (850 - 300);
    return percentage * 180;
  };

  if (!ctosData) return null;

  const score = parseInt(ctosData.score);
  const scorePosition = getScorePosition(score);

  return (
    <div className="min-h-screen bg-white p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="max-w-6xl mx-auto bg-white shadow-lg border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-start p-4 bg-white border-b border-gray-300">
          <div className="flex items-center gap-4">
            {/* CTOS Logo recreated from reference */}
            <div className="flex items-center">
              <svg width="120" height="40" viewBox="0 0 120 40" className="mr-2">
                {/* Letter C */}
                <path d="M8 8 Q8 4 12 4 L20 4 Q24 4 24 8 L24 12 L20 12 L20 8 L12 8 L12 32 L20 32 L20 28 L24 28 L24 32 Q24 36 20 36 L12 36 Q8 36 8 32 Z" fill="#0D9488"/>
                {/* Letter T */}
                <path d="M28 4 L52 4 L52 8 L42 8 L42 36 L38 36 L38 8 L28 8 Z" fill="#0D9488"/>
                {/* Letter O */}
                <circle cx="64" cy="20" r="16" fill="none" stroke="#0D9488" strokeWidth="4"/>
                <circle cx="64" cy="20" r="8" fill="white"/>
                {/* Letter S with orange accent */}
                <path d="M84 12 Q84 8 88 8 L96 8 Q100 8 100 12 L100 16 L96 16 L96 12 L88 12 L88 16 Q88 20 92 20 L96 20 Q100 20 100 24 L100 28 Q100 32 96 32 L88 32 Q84 32 84 28 L84 24 L88 24 L88 28 L96 28 L96 24 Q96 20 92 20 L88 20 Q84 20 84 16 Z" fill="#0D9488"/>
                <polygon points="100,4 116,4 116,20 100,20" fill="#F97316"/>
              </svg>
            </div>
            <div className="text-xs text-teal-700 font-normal">Knowledge Creates Confidence</div>
          </div>
          
          <div className="text-left text-xs text-black leading-tight">
            <div className="font-bold">Strictly Confidential</div>
            <div>Report No.: CI-2831-20241004139936</div>
            <div>Attention: selfcheck@app (SELFCHECK_APP)</div>
            <div>Account: CDS (CTOS DATA SYSTEMS SDN BHD SELFCHECK CDS)</div>
            <div>Date: 2024-10-04 15:39:36</div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold mb-2">Page 3 of 8</div>
            <div className="text-xl font-bold mb-1">MyCTOS SCORE REPORT</div>
            <div className="text-xs">@ the request of SING WEI LOON (950206015427)</div>
          </div>
        </div>

        <div className="flex">
          {/* Left side - Report details */}
          <div className="flex-1 border-r border-gray-300">
            {/* Section A Header */}
            <div className="bg-teal-600 text-white p-2 text-sm font-bold">
              <span>A: SNAPSHOT </span>
              <span className="italic font-normal">GAMBARAN RINGKAS</span>
            </div>

            {/* ID Verification Header */}
            <div className="bg-teal-500 text-white p-2 text-sm font-bold">
              <span>ID Verification </span>
              <span className="italic font-normal">Pengesahan ID</span>
            </div>

            {/* ID Verification Table */}
            <table className="w-full text-xs border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-3 bg-gray-100 font-bold w-2/5 align-top">
                    Name (Your input)<br/>
                    <span className="italic font-normal">Nama (Input anda)</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-white align-top">{ctosData.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-white font-bold align-top">
                    New ID / Old ID (Your input)<br/>
                    <span className="italic font-normal">ID Baru / ID Lama (Input anda)</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-white align-top">{ctosData.newId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-gray-100 font-bold align-top">
                    Name <span className="italic font-normal">Nama</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-gray-100 align-top">{ctosData.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-white font-bold align-top">
                    New ID <span className="italic font-normal">ID Baru</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-white align-top">{ctosData.newId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-gray-100 font-bold align-top">
                    Old ID <span className="italic font-normal">ID Lama</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-gray-100 align-top">-</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-white font-bold align-top">
                    Date of Birth <span className="italic font-normal">Tarikh Lahir</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-white align-top">{ctosData.dateOfBirth}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-gray-100 font-bold align-top">
                    Address 1 <span className="italic font-normal">Alamat 1</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-gray-100 align-top">
                    {ctosData.address1}<br/>
                    <span className="text-gray-600">Source: SSM</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-3 bg-white font-bold align-top">
                    Address 2 <span className="italic font-normal">Alamat 2</span>
                  </td>
                  <td className="border border-gray-400 p-3 bg-white align-top">{ctosData.address2 || '-'}</td>
                </tr>
              </tbody>
            </table>

            {/* Credit Info Header */}
            <div className="bg-teal-500 text-white p-2 text-sm font-bold">
              <span>Credit Info at a Glance </span>
              <span className="italic font-normal">Ringkasan Maklumat Kredit</span>
            </div>

            {/* Credit Info Table */}
            <table className="w-full text-xs border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left font-bold">
                    Credit Info <span className="italic font-normal">Maklumat Kredit</span>
                  </th>
                  <th className="border border-gray-400 p-2 text-left font-bold">
                    Source <span className="italic font-normal">Sumber</span>
                  </th>
                  <th className="border border-gray-400 p-2 text-left font-bold">
                    Value <span className="italic font-normal">Nilai</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white">
                    Bankruptcy Proceedings Record<br/>
                    <span className="italic">Rekod Prosiding Muflis</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white">Newspaper/Gazette</td>
                  <td className="border border-gray-400 p-2 bg-white">YES</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-50">
                    Legal records in past 24 months (personal<br/>
                    capacity)<br/>
                    <span className="italic">Rekod undang-undang dalam tempoh 24 bulan yang</span><br/>
                    <span className="italic">lalu (kapasiti peribadi)</span><br/>
                    - Number <span className="italic">Bilangan</span><br/>
                    - Value <span className="italic">Nilai</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-50 align-top">CTOS</td>
                  <td className="border border-gray-400 p-2 bg-gray-50 align-top">0<br/><br/><br/><br/>0</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white">
                    Legal records in past 24 months (non-personal<br/>
                    capacity)<br/>
                    <span className="italic">Rekod undang-undang dalam tempoh 24 bulan yang</span><br/>
                    <span className="italic">lalu (kapasiti bukan peribadi)</span><br/>
                    - Number <span className="italic">Bilangan</span><br/>
                    - Value <span className="italic">Nilai</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white align-top">CTOS</td>
                  <td className="border border-gray-400 p-2 bg-white align-top">0<br/><br/><br/><br/>0</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-50">
                    Availability of Legal Records<br/>
                    <span className="italic">Rekod Undang-undang</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-50">BNM</td>
                  <td className="border border-gray-400 p-2 bg-gray-50">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white">
                    Special Attention Accounts<br/>
                    <span className="italic">Akaun di bawah Perhatian Khas</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white">BNM</td>
                  <td className="border border-gray-400 p-2 bg-white">YES</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-50">
                    Outstanding credit facilities<br/>
                    <span className="italic">Kemudahan Kredit Belum Jelas</span><br/>
                    - Number <span className="italic">Bilangan</span><br/>
                    - Value <span className="italic">Nilai</span><br/>
                    - Installments in arrears in past 12 months<br/>
                    <span className="italic">Ansuran tertunggak dalam tempoh 12 bulan yang lalu</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-50 align-top">BNM</td>
                  <td className="border border-gray-400 p-2 bg-gray-50 align-top">1<br/>0.00<br/>NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white">
                    Credit applications in past 12 months<br/>
                    <span className="italic">Permohonan Kredit dalam tempoh 12 bulan yang lalu</span><br/>
                    - Total <span className="italic">Jumlah</span><br/>
                    - Approved <span className="italic">Diluluskan</span><br/>
                    - Pending <span className="italic">Dalam pertimbangan</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white align-top">BNM</td>
                  <td className="border border-gray-400 p-2 bg-white align-top">0<br/>0<br/>0</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-50">
                    Availability of Trade Referee Listing<br/>
                    <span className="italic">Rekod Rujukan Perdagangan</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-50">CTOS</td>
                  <td className="border border-gray-400 p-2 bg-gray-50">NO</td>
                </tr>
              </tbody>
            </table>

            {/* eTR Plus Section */}
            <div className="bg-teal-500 text-white p-2 text-sm font-bold">
              eTR Plus at a Glance
            </div>
          </div>

          {/* Right side - Score gauge */}
          <div className="w-80 bg-white">
            <div className="p-4">
              <div className="text-center">
                {/* CTOS Score Header */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <svg width="80" height="26" viewBox="0 0 80 26">
                    <path d="M5 5 Q5 2 8 2 L13 2 Q16 2 16 5 L16 8 L13 8 L13 5 L8 5 L8 21 L13 21 L13 18 L16 18 L16 21 Q16 24 13 24 L8 24 Q5 24 5 21 Z" fill="#0D9488"/>
                    <path d="M18 2 L34 2 L34 5 L28 5 L28 24 L25 24 L25 5 L18 5 Z" fill="#0D9488"/>
                    <circle cx="42" cy="13" r="10" fill="none" stroke="#0D9488" strokeWidth="2.5"/>
                    <circle cx="42" cy="13" r="5" fill="white"/>
                    <path d="M55 8 Q55 5 58 5 L63 5 Q66 5 66 8 L66 10 L63 10 L63 8 L58 8 L58 10 Q58 13 61 13 L63 13 Q66 13 66 16 L66 18 Q66 21 63 21 L58 21 Q55 21 55 18 L55 16 L58 16 L58 18 L63 18 L63 16 Q63 13 60 13 L58 13 Q55 13 55 10 Z" fill="#0D9488"/>
                    <polygon points="66,2 77,2 77,13 66,13" fill="#F97316"/>
                  </svg>
                  <div className="text-xl font-semibold text-teal-600">Score</div>
                </div>

                {/* Score Gauge recreated exactly from reference */}
                <div className="relative w-80 h-48 mx-auto mb-6">
                  <svg viewBox="0 0 320 200" className="w-full h-full">
                    {/* Poor section (Red) */}
                    <path d="M 40 160 A 120 120 0 0 1 100 40" fill="none" stroke="#DC2626" strokeWidth="24" strokeLinecap="round" />
                    <text x="70" y="130" textAnchor="middle" className="text-sm font-bold fill-white">Poor</text>
                    <text x="70" y="145" textAnchor="middle" className="text-xs fill-white">300 - 529</text>
                    
                    {/* Low section (Orange) */}
                    <path d="M 105 35 A 120 120 0 0 1 140 25" fill="none" stroke="#F97316" strokeWidth="24" strokeLinecap="round" />
                    <text x="122" y="50" textAnchor="middle" className="text-sm font-bold fill-white">Low</text>
                    <text x="122" y="65" textAnchor="middle" className="text-xs fill-white">530 - 650</text>
                    
                    {/* Fair section (Yellow) */}
                    <path d="M 145 24 A 120 120 0 0 1 175 25" fill="none" stroke="#EAB308" strokeWidth="24" strokeLinecap="round" />
                    <text x="160" y="50" textAnchor="middle" className="text-sm font-bold fill-white">Fair</text>
                    <text x="160" y="65" textAnchor="middle" className="text-xs fill-white">651 - 696</text>
                    
                    {/* Good section (Light Green) */}
                    <path d="M 180 26 A 120 120 0 0 1 200 35" fill="none" stroke="#84CC16" strokeWidth="24" strokeLinecap="round" />
                    <text x="190" y="50" textAnchor="middle" className="text-sm font-bold fill-white">Good</text>
                    <text x="190" y="65" textAnchor="middle" className="text-xs fill-white">697 - 717</text>
                    
                    {/* Very Good section (Green) */}
                    <path d="M 205 38 A 120 120 0 0 1 235 60" fill="none" stroke="#22C55E" strokeWidth="24" strokeLinecap="round" />
                    <text x="220" y="75" textAnchor="middle" className="text-sm font-bold fill-white">Very Good</text>
                    <text x="220" y="90" textAnchor="middle" className="text-xs fill-white">718 - 743</text>
                    
                    {/* Excellent section (Dark Green) */}
                    <path d="M 240 65 A 120 120 0 0 1 280 160" fill="none" stroke="#16A34A" strokeWidth="24" strokeLinecap="round" />
                    <text x="260" y="110" textAnchor="middle" className="text-sm font-bold fill-white">Excellent</text>
                    <text x="260" y="125" textAnchor="middle" className="text-xs fill-white">744 - 850</text>
                    
                    {/* Scale labels */}
                    <text x="40" y="185" textAnchor="middle" className="text-lg font-bold">300</text>
                    <text x="280" y="185" textAnchor="middle" className="text-lg font-bold">850</text>
                    
                    {/* Pointer */}
                    <g transform={`rotate(${scorePosition} 160 160)`}>
                      <polygon points="160,160 165,155 165,110 155,110 155,155" fill="#2D3748" />
                      <circle cx="160" cy="160" r="6" fill="#2D3748" />
                    </g>
                  </svg>
                  
                  {/* Score number display */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="text-5xl font-bold text-black">{score}</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 text-left">
                  <div className="font-bold text-sm mb-1">What is affecting my Score?</div>
                  <div className="text-xs italic text-gray-700 mb-3">Apakah yang menjejaskan Skor anda ?</div>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-semibold">1. There is serious delinquency (over 90 days past due) or adverse record filed.</div>
                      <div className="text-gray-600 italic">
                        Terdapat delinkuensi serius (yang tertunggak melebihi 90 hari) atau rekod buruk telah difailkan.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold">2. You have a higher number of outstanding loans than the average credit user.</div>
                      <div className="text-gray-600 italic">
                        Anda mempunyai bilangan pinjaman tertunggak yang lebih tinggi berbanding dengan purata pengguna kredit.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold">3. There is delinquency (past due with no minimum payment) in your credit report.</div>
                      <div className="text-gray-600 italic">
                        Terdapat delinkuensi (tunggakan tanpa bayaran minimum) dalam laporan kredit anda.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold">4. There is not enough recent account information on your credit report.</div>
                      <div className="text-gray-600 italic">
                        Maklumat akaun terkini tidak mencukupi dalam laporan kredit anda.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="p-3 bg-white text-xs text-gray-700 border-t border-gray-300 leading-tight">
          <div className="italic">
            DISCLAIMER: This MyCTOS Report may not be reproduced in whole, in part or in any other manner. The report is provided in strict confidence for your personal use only. This report contains information 
            extracted from public sources as well as from credit institutions which our credit bureau has been verified unless otherwise stated in this report. In the event of ambiguities, conflicts or possible variations in interpretation 
            between the English and Malay version of this credit report, the English version shall always prevail.
          </div>
        </div>
      </div>

      {/* Back button notice */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Press ESC to go back to the form
      </div>
    </div>
  );
};

export default CTOSReport;