import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const data = localStorage.getItem('ctosData');
    if (!data) {
      navigate('/');
      return;
    }
    
    const parsedData = JSON.parse(data);
    setCTOSData(parsedData);
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
    <div className="min-h-screen bg-white p-4 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-none border border-black">
        {/* Header */}
        <div className="flex justify-between items-start p-4 bg-white border-b border-black">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start">
              <div className="text-4xl font-bold text-teal-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>ctos</div>
              <div className="text-xs text-black font-normal">Knowledge Creates Confidence</div>
            </div>
          </div>
          
          <div className="text-left text-xs text-black leading-tight">
            <div className="font-bold">Strictly Confidential</div>
            <div>Report No.: CI-2831-20241004139936</div>
            <div>Attention: selfcheck@app (SELFCHECK_APP)</div>
            <div>Account: CDS (CTOS DATA SYSTEMS SDN BHD SELFCHECK CDS)</div>
            <div>Date: 2024-10-04 15:39:36</div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold mb-4">Page 3 of 8</div>
            <div className="text-2xl font-bold mb-1">MyCTOS SCORE REPORT</div>
            <div className="text-xs">@ the request of SING WEI LOON (950206015427)</div>
          </div>
        </div>

        <div className="flex">
          {/* Left side - Report details */}
          <div className="flex-1 border-r border-black">
            {/* Section A Header */}
            <div className="bg-teal-700 text-white p-2 text-sm font-bold">
              <span>A: SNAPSHOT </span>
              <span className="italic font-normal">GAMBARAN RINGKAS</span>
            </div>

            {/* ID Verification Header */}
            <div className="bg-teal-600 text-white p-2 text-sm font-bold">
              <span>ID Verification </span>
              <span className="italic font-normal">Pengesahan ID</span>
            </div>

            {/* ID Verification Table */}
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-200 font-bold w-2/5 align-top">
                    Name (Your input)<br/>
                    <span className="italic font-normal">Nama (Input anda)</span>
                  </td>
                  <td className="border border-gray-400 p-2 align-top">{ctosData.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white font-bold align-top">
                    New ID / Old ID (Your input)<br/>
                    <span className="italic font-normal">ID Baru / ID Lama (Input anda)</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white align-top">{ctosData.newId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-200 font-bold align-top">
                    Name <span className="italic font-normal">Nama</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-200 align-top">{ctosData.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white font-bold align-top">
                    New ID <span className="italic font-normal">ID Baru</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white align-top">{ctosData.oldId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-200 font-bold align-top">
                    Old ID <span className="italic font-normal">ID Lama</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-200 align-top"></td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white font-bold align-top">
                    Date of Birth <span className="italic font-normal">Tarikh Lahir</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white align-top">{ctosData.dateOfBirth}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-gray-200 font-bold align-top">
                    Address 1 <span className="italic font-normal">Alamat 1</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-200 align-top">
                    {ctosData.address1}<br/>
                    Source: SSM
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 bg-white font-bold align-top">
                    Address 2 <span className="italic font-normal">Alamat 2</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-white align-top">{ctosData.address2 || '-'}</td>
                </tr>
              </tbody>
            </table>

            {/* Credit Info Header */}
            <div className="bg-teal-600 text-white p-2 text-sm font-bold mt-4">
              <span>Credit Info at a Glance </span>
              <span className="italic font-normal">Ringkasan Maklumat Kredit</span>
            </div>

            {/* Credit Info Table */}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-200">
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
                  <td className="border border-gray-400 p-2 bg-gray-100">
                    Legal records in past 24 months (personal<br/>
                    capacity)<br/>
                    <span className="italic">Rekod undang-undang dalam tempoh 24 bulan yang</span><br/>
                    <span className="italic">lalu (kapasiti peribadi)</span><br/>
                    - Number <span className="italic">Bilangan</span><br/>
                    - Value <span className="italic">Nilai</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-100 align-top">CTOS</td>
                  <td className="border border-gray-400 p-2 bg-gray-100 align-top">0<br/><br/><br/><br/>0</td>
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
                  <td className="border border-gray-400 p-2 bg-gray-100">
                    Availability of Legal Records<br/>
                    <span className="italic">Rekod Undang-undang</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-100">BNM</td>
                  <td className="border border-gray-400 p-2 bg-gray-100">NO</td>
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
                  <td className="border border-gray-400 p-2 bg-gray-100">
                    Outstanding credit facilities<br/>
                    <span className="italic">Kemudahan Kredit Belum Jelas</span><br/>
                    - Number <span className="italic">Bilangan</span><br/>
                    - Value <span className="italic">Nilai</span><br/>
                    - Installments in arrears in past 12 months<br/>
                    <span className="italic">Ansuran tertunggak dalam tempoh 12 bulan yang lalu</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-100 align-top">BNM</td>
                  <td className="border border-gray-400 p-2 bg-gray-100 align-top">1<br/>0.00<br/>NO</td>
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
                  <td className="border border-gray-400 p-2 bg-gray-100">
                    Availability of Trade Referee Listing<br/>
                    <span className="italic">Rekod Rujukan Perdagangan</span>
                  </td>
                  <td className="border border-gray-400 p-2 bg-gray-100">CTOS</td>
                  <td className="border border-gray-400 p-2 bg-gray-100">NO</td>
                </tr>
              </tbody>
            </table>

            {/* eTR Plus Section */}
            <div className="bg-teal-600 text-white p-2 text-sm font-bold mt-4">
              eTR Plus at a Glance
            </div>
          </div>

          {/* Right side - Score gauge */}
          <div className="w-80 bg-white border-l-0">
            <div className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="text-3xl font-bold text-teal-600" style={{ fontFamily: 'Arial, sans-serif' }}>ctos</div>
                  <div className="text-xl font-semibold text-teal-600" style={{ fontFamily: 'Arial, sans-serif' }}>Score</div>
                </div>

                {/* Score Gauge */}
                <div className="relative w-64 h-36 mx-auto mb-4">
                  <svg viewBox="0 0 240 120" className="w-full h-full">
                    {/* Background gauge sections with exact colors from image */}
                    <path d="M 30 100 A 90 90 0 0 1 80 25" fill="none" stroke="#dc2626" strokeWidth="18" strokeLinecap="round" />
                    <path d="M 85 20 A 90 90 0 0 1 120 15" fill="none" stroke="#f97316" strokeWidth="18" strokeLinecap="round" />
                    <path d="M 120 15 A 90 90 0 0 1 155 20" fill="none" stroke="#eab308" strokeWidth="18" strokeLinecap="round" />
                    <path d="M 160 25 A 90 90 0 0 1 210 100" fill="none" stroke="#22c55e" strokeWidth="18" strokeLinecap="round" />
                    
                    {/* Score labels with exact positioning */}
                    <text x="45" y="110" textAnchor="middle" className="text-xs font-bold fill-red-600">Poor</text>
                    <text x="90" y="28" textAnchor="middle" className="text-xs font-bold fill-orange-600">Fair</text>
                    <text x="120" y="18" textAnchor="middle" className="text-xs font-bold fill-yellow-600">Good</text>
                    <text x="150" y="28" textAnchor="middle" className="text-xs font-bold fill-green-600">Very Good</text>
                    <text x="195" y="110" textAnchor="middle" className="text-xs font-bold fill-green-600">Excellent</text>
                    
                    {/* Score range labels */}
                    <text x="45" y="95" textAnchor="middle" className="text-xs fill-gray-600">300 - 499</text>
                    <text x="90" y="40" textAnchor="middle" className="text-xs fill-gray-600">500 - 579</text>
                    <text x="120" y="30" textAnchor="middle" className="text-xs fill-gray-600">580 - 669</text>
                    <text x="150" y="40" textAnchor="middle" className="text-xs fill-gray-600">670 - 739</text>
                    <text x="195" y="95" textAnchor="middle" className="text-xs fill-gray-600">740 - 850</text>
                    
                    {/* Pointer - exact style from image */}
                    <g transform={`rotate(${scorePosition - 90} 120 100)`}>
                      <polygon points="120,100 125,95 125,50 115,50 115,95" fill="#333" />
                      <circle cx="120" cy="100" r="5" fill="#333" />
                    </g>
                  </svg>
                  
                  {/* Score numbers positioned exactly like image */}
                  <div className="absolute bottom-0 left-0 text-sm font-bold">300</div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-4xl font-bold">{score}</div>
                  <div className="absolute bottom-0 right-0 text-sm font-bold">850</div>
                </div>

                <div className="bg-yellow-100 border border-yellow-300 p-3 rounded text-left">
                  <div className="font-bold text-sm mb-1">What is affecting my Score?</div>
                  <div className="text-xs italic text-gray-700 mb-3">Apakah yang menjejaskan Skor anda ?</div>
                  
                  <div className="space-y-2 text-xs">
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
        <div className="p-3 bg-white text-xs text-gray-700 border-t border-black leading-tight">
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