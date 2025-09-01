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

  const getScoreColor = (score: number) => {
    if (score >= 740) return { bg: 'bg-green-500', text: 'text-green-600' };
    if (score >= 670) return { bg: 'bg-blue-500', text: 'text-blue-600' };
    if (score >= 580) return { bg: 'bg-yellow-500', text: 'text-yellow-600' };
    if (score >= 500) return { bg: 'bg-orange-500', text: 'text-orange-600' };
    return { bg: 'bg-red-500', text: 'text-red-600' };
  };

  const getScorePosition = (score: number) => {
    // Map score to degrees (0-180 degrees for semicircle)
    const percentage = (score - 300) / (850 - 300);
    return percentage * 180;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 740) return 'Excellent';
    if (score >= 670) return 'Very Good';
    if (score >= 580) return 'Good';
    if (score >= 500) return 'Fair';
    return 'Poor';
  };

  if (!ctosData) return null;

  const score = parseInt(ctosData.score);
  const scoreColor = getScoreColor(score);
  const scorePosition = getScorePosition(score);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-teal-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">ctos</div>
              <div>
                <div className="text-sm">Knowledge Creates Confidence</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">Strictly Confidential</div>
              <div className="text-sm">Report No.: CI-2831-20241004139936</div>
              <div className="text-sm">Attention: selfcheck@app (SELFCHECK_APP)</div>
              <div className="text-sm">Account: CDS (CTOS DATA SYSTEMS SDN BHD SELFCHECK CDS)</div>
              <div className="text-sm">Date: 2024-10-04 15:39:36</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">Page 3 of 8</div>
              <div className="text-2xl font-bold mt-2">MyCTOS SCORE REPORT</div>
              <div className="text-sm mt-1">@ the request of SING WEI LOON (950206015427)</div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left side - Report details */}
          <div className="flex-1">
            {/* ID Verification Section */}
            <div className="bg-teal-600 text-white p-2">
              <div className="flex items-center gap-2">
                <div className="font-bold">A: SNAPSHOT</div>
                <div className="italic">GAMBARAN RINGKAS</div>
              </div>
            </div>

            <div className="bg-teal-500 text-white p-2">
              <div className="flex items-center gap-2">
                <div className="font-bold">ID Verification</div>
                <div className="italic">Pengesahan ID</div>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold w-1/3">
                  Name (Your input)<br/>
                  <span className="italic">Nama (Input anda)</span>
                </td>
                <td className="border border-gray-300 p-2">{ctosData.name}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  New ID / Old ID (Your input)<br/>
                  <span className="italic">ID Baru / ID Lama (Input anda)</span>
                </td>
                <td className="border border-gray-300 p-2">{ctosData.newId}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  Name <span className="italic">Nama</span>
                </td>
                <td className="border border-gray-300 p-2">{ctosData.name}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  New ID <span className="italic">ID Baru</span>
                </td>
                <td className="border border-gray-300 p-2">{ctosData.oldId}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  Old ID <span className="italic">ID Lama</span>
                </td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  Date of Birth <span className="italic">Tarikh Lahir</span>
                </td>
                <td className="border border-gray-300 p-2">{ctosData.dateOfBirth}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  Address 1 <span className="italic">Alamat 1</span>
                </td>
                <td className="border border-gray-300 p-2">
                  {ctosData.address1}<br/>
                  Source: SSM
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  Address 2 <span className="italic">Alamat 2</span>
                </td>
                <td className="border border-gray-300 p-2">{ctosData.address2 || '-'}</td>
              </tr>
            </table>

            {/* Credit Info Section */}
            <div className="bg-teal-600 text-white p-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="font-bold">Credit Info at a Glance</div>
                <div className="italic">Ringkasan Maklumat Kredit</div>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <tr className="bg-gray-100">
                <td className="border border-gray-300 p-2 font-semibold">
                  Credit Info <span className="italic">Maklumat Kredit</span>
                </td>
                <td className="border border-gray-300 p-2 font-semibold">
                  Source <span className="italic">Sumber</span>
                </td>
                <td className="border border-gray-300 p-2 font-semibold">
                  Value <span className="italic">Nilai</span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Bankruptcy Proceedings Record<br/>
                  <span className="italic">Rekod Prosiding Muflis</span>
                </td>
                <td className="border border-gray-300 p-2">Newspaper/Gazette</td>
                <td className="border border-gray-300 p-2">YES</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Legal records in past 24 months (personal capacity)<br/>
                  <span className="italic">Rekod undang-undang dalam tempoh 24 bulan yang lalu (kapasiti peribadi)</span><br/>
                  - Number <span className="italic">Bilangan</span><br/>
                  - Value <span className="italic">Nilai</span>
                </td>
                <td className="border border-gray-300 p-2">CTOS</td>
                <td className="border border-gray-300 p-2">0<br/><br/>0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Legal records in past 24 months (non-personal capacity)<br/>
                  <span className="italic">Rekod undang-undang dalam tempoh 24 bulan yang lalu (kapasiti bukan peribadi)</span><br/>
                  - Number <span className="italic">Bilangan</span><br/>
                  - Value <span className="italic">Nilai</span>
                </td>
                <td className="border border-gray-300 p-2">CTOS</td>
                <td className="border border-gray-300 p-2">0<br/><br/>0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Availability of Legal Records<br/>
                  <span className="italic">Rekod Undang-undang</span>
                </td>
                <td className="border border-gray-300 p-2">BNM</td>
                <td className="border border-gray-300 p-2">NO</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Special Attention Accounts<br/>
                  <span className="italic">Akaun di bawah Perhatian Khas</span>
                </td>
                <td className="border border-gray-300 p-2">BNM</td>
                <td className="border border-gray-300 p-2">YES</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Outstanding credit facilities<br/>
                  <span className="italic">Kemudahan Kredit Belum Jelas</span><br/>
                  - Number <span className="italic">Bilangan</span><br/>
                  - Value <span className="italic">Nilai</span><br/>
                  - Installments in arrears in past 12 months<br/>
                  <span className="italic">Ansuran tertunggak dalam tempoh 12 bulan yang lalu</span>
                </td>
                <td className="border border-gray-300 p-2">BNM</td>
                <td className="border border-gray-300 p-2">1<br/>0.00<br/>NO</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Credit applications in past 12 months<br/>
                  <span className="italic">Permohonan Kredit dalam tempoh 12 bulan yang lalu</span><br/>
                  - Total <span className="italic">Jumlah</span><br/>
                  - Approved <span className="italic">Diluluskan</span><br/>
                  - Pending <span className="italic">Dalam pertimbangan</span>
                </td>
                <td className="border border-gray-300 p-2">BNM</td>
                <td className="border border-gray-300 p-2">0<br/>0<br/>0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Availability of Trade Referee Listing<br/>
                  <span className="italic">Rekod Rujukan Perdagangan</span>
                </td>
                <td className="border border-gray-300 p-2">CTOS</td>
                <td className="border border-gray-300 p-2">NO</td>
              </tr>
            </table>

            {/* eTR Plus Section */}
            <div className="bg-teal-600 text-white p-2 mt-4">
              <div className="font-bold">eTR Plus at a Glance</div>
            </div>
          </div>

          {/* Right side - Score gauge */}
          <div className="w-80 p-6 bg-white border-l border-gray-300">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-2xl font-bold text-teal-600">ctos</div>
                <div className="text-xl font-semibold text-teal-600">Score</div>
              </div>

              {/* Score Gauge */}
              <div className="relative w-64 h-32 mx-auto mb-6">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Background arc sections */}
                  <path d="M 20 80 A 80 80 0 0 1 60 20" fill="none" stroke="#dc2626" strokeWidth="20" />
                  <path d="M 60 20 A 80 80 0 0 1 100 10" fill="none" stroke="#ea580c" strokeWidth="20" />
                  <path d="M 100 10 A 80 80 0 0 1 140 20" fill="none" stroke="#eab308" strokeWidth="20" />
                  <path d="M 140 20 A 80 80 0 0 1 180 80" fill="none" stroke="#059669" strokeWidth="20" />
                  
                  {/* Score labels */}
                  <text x="30" y="95" textAnchor="middle" className="text-xs fill-red-600 font-semibold">Poor</text>
                  <text x="65" y="15" textAnchor="middle" className="text-xs fill-orange-600 font-semibold">Fair</text>
                  <text x="100" y="8" textAnchor="middle" className="text-xs fill-yellow-600 font-semibold">Good</text>
                  <text x="135" y="15" textAnchor="middle" className="text-xs fill-green-600 font-semibold">Very Good</text>
                  <text x="170" y="95" textAnchor="middle" className="text-xs fill-green-700 font-semibold">Excellent</text>
                  
                  {/* Score range labels */}
                  <text x="20" y="85" textAnchor="middle" className="text-xs fill-gray-600">300 - 499</text>
                  <text x="60" y="25" textAnchor="middle" className="text-xs fill-gray-600">500 - 579</text>
                  <text x="100" y="20" textAnchor="middle" className="text-xs fill-gray-600">580 - 669</text>
                  <text x="140" y="25" textAnchor="middle" className="text-xs fill-gray-600">670 - 739</text>
                  <text x="180" y="85" textAnchor="middle" className="text-xs fill-gray-600">740 - 850</text>
                  
                  {/* Pointer */}
                  <g transform={`rotate(${scorePosition} 100 80)`}>
                    <line x1="100" y1="80" x2="100" y2="30" stroke="#333" strokeWidth="3" />
                    <circle cx="100" cy="80" r="4" fill="#333" />
                  </g>
                </svg>
                
                {/* Score number */}
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">300</div>
                    <div className="text-4xl font-bold">{score}</div>
                    <div className="text-sm text-gray-600">850</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">What is affecting my Score?</div>
                <div className="text-sm text-gray-700 italic mb-3">Apakah yang menjejaskan Skor anda ?</div>
                
                <div className="text-left space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">1. There is serious delinquency (over 90 days past due) or adverse record filed.</div>
                    <div className="text-gray-600 text-xs mt-1">
                      Terdapat delinkuensi serius (yang tertunggak melebihi 90 hari) atau rekod buruk telah difailkan.
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-semibold">2. You have a higher number of outstanding loans than the average credit user.</div>
                    <div className="text-gray-600 text-xs mt-1">
                      Anda mempunyai bilangan pinjaman tertunggak yang lebih tinggi berbanding dengan purata pengguna kredit.
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-semibold">3. There is delinquency (past due with no minimum payment) in your credit report.</div>
                    <div className="text-gray-600 text-xs mt-1">
                      Terdapat delinkuensi (tunggakan tanpa bayaran minimum) dalam laporan kredit anda.
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-semibold">4. There is not enough recent account information on your credit report.</div>
                    <div className="text-gray-600 text-xs mt-1">
                      Maklumat akaun terkini tidak mencukupi dalam laporan kredit anda.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="p-4 bg-gray-50 text-xs text-gray-600 border-t">
          <div className="italic">
            DISCLAIMER: This MyCTOS Report may not be reproduced in whole, in part or in any other manner. The report is provided in strict confidence for your personal use only. This report contains information 
            extracted from the public sources as well as from credit institutions which our credit bureau has been verified unless otherwise stated in this report. In the event of ambiguities, conflicts or possible variations in interpretation 
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