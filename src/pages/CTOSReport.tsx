import { useEffect, useMemo, useState } from 'react';
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
    const data = safeLocalStorage.getJSON<CTOSData>('ctosData');
    if (!data) {
      navigate('/');
      return;
    }
    setCTOSData(data);
  }, [navigate]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const decodeHtml = (value: string) =>
    value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x27;/g, "'");

  const displayValue = (value?: string | null) => {
    if (!value) return '-';
    const trimmed = value.trim();
    if (!trimmed.length) return '-';
    return decodeHtml(trimmed);
  };

  const reportPayload = useMemo(() => {
    if (!ctosData) {
      return null;
    }

    const rawScore = parseInt(ctosData.score || '457', 10);
    const score = Number.isFinite(rawScore)
      ? Math.min(850, Math.max(300, rawScore))
      : 457;

    return {
      name: displayValue(ctosData.name),
      newId: displayValue(ctosData.newId),
      oldId: displayValue(ctosData.oldId),
      dob: displayValue(ctosData.dateOfBirth),
      address1: displayValue(ctosData.address1),
      address2: displayValue(ctosData.address2),
      score,
    };
  }, [ctosData]);

  if (!reportPayload) return null;

  const reportDate = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const requestName =
    reportPayload.name !== '-' ? reportPayload.name : 'Customer';

  const pointerAngle = ((reportPayload.score - 300) / (850 - 300)) * 180 - 90;

  const primaryColor = '#007c87';
  const secondaryColor = '#009aa8';
  const tableHeaderBg = '#e0ebef';
  const tableLabelBg = '#ebf3f5';
  const disclaimerColor = '#2596be';

  return (
    <div className="min-h-screen bg-[#e6eef1] py-6 px-3 md:px-6 text-[#0f3040]">
      <div
        className="max-w-5xl mx-auto bg-white border shadow-md"
        style={{ borderColor: primaryColor }}
      >

        <div
          className="flex flex-col lg:flex-row justify-between gap-4 px-6 py-5 border-b bg-white"
          style={{ borderColor: primaryColor }}
        >
          <div className="flex flex-col items-center">
            <img
              src="/lovable-uploads/ctoslogo.png"
              alt="CTOS"
              className="h-16 w-auto"
            />
            <div className="text-[8.5px] tracking-[0.4em] uppercase text-[#004f56] font-semibold mt-2">
              Knowledge Creates Confidence
            </div>
          </div>

          <div className="text-[10px] leading-4 text-[#0f3040]">
            <div className="font-bold uppercase tracking-[0.14em]">
              Strictly Confidential
            </div>
            <div>Report No.: CI-2831-20241004139936</div>
            <div>Attention: selfcheck@app (SELFCHECK_APP)</div>
            <div>Account: CDS (CTOS DATA SYSTEMS SDN BHD SELFCHECK CDS)</div>
            <div>Date: {reportDate}</div>
          </div>

          <div className="text-right text-xs leading-4 text-[#0f3040]">
            <div className="font-semibold mb-2 tracking-[0.12em] uppercase">
              Page 3 of 8
            </div>
            <div className="text-xl font-bold mb-1 tracking-[0.08em]">
              MyCTOS SCORE REPORT
            </div>
            <div className="text-[11px]">
              @ the request of {requestName}
              {reportPayload.newId !== '-' ? ` (${reportPayload.newId})` : ''}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div
            className="lg:w-2/3 border-r"
            style={{ borderColor: primaryColor }}
          >
            <div
              className="text-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: primaryColor }}
            >
              A: Snapshot <span className="italic font-normal">Gambaran Ringkas</span>
            </div>
            <div
              className="text-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: secondaryColor }}
            >
              ID Verification <span className="italic font-normal">Pengesahan ID</span>
            </div>

            <table
              className="w-full text-[11px] border-collapse border"
              style={{ borderColor: primaryColor }}
            >
              <tbody>
                {[
                  {
                    label: (
                      <>
                        Name (Your input)
                        <br />
                        <span className="italic font-normal">Nama (Input anda)</span>
                      </>
                    ),
                    value: reportPayload.name,
                    shaded: true,
                  },
                  {
                    label: (
                      <>
                        New ID / Old ID (Your input)
                        <br />
                        <span className="italic font-normal">
                          ID Baru / ID Lama (Input anda)
                        </span>
                      </>
                    ),
                    value: reportPayload.newId,
                  },
                  {
                    label: (
                      <>
                        Name <span className="italic font-normal">Nama</span>
                      </>
                    ),
                    value: reportPayload.name,
                    shaded: true,
                  },
                  {
                    label: (
                      <>
                        New ID <span className="italic font-normal">ID Baru</span>
                      </>
                    ),
                    value: reportPayload.newId,
                  },
                  {
                    label: (
                      <>
                        Old ID <span className="italic font-normal">ID Lama</span>
                      </>
                    ),
                    value: reportPayload.oldId,
                    shaded: true,
                  },
                  {
                    label: (
                      <>
                        Date of Birth{' '}
                        <span className="italic font-normal">Tarikh Lahir</span>
                      </>
                    ),
                    value: reportPayload.dob,
                  },
                  {
                    label: (
                      <>
                        Address 1{' '}
                        <span className="italic font-normal">Alamat 1</span>
                      </>
                    ),
                    value: (
                      <>
                        {reportPayload.address1}
                        {reportPayload.address1 !== '-' && (
                          <div className="text-[10px] text-[#555] mt-1">
                            Source: SSM
                          </div>
                        )}
                      </>
                    ),
                    shaded: true,
                  },
                  {
                    label: (
                      <>
                        Address 2{' '}
                        <span className="italic font-normal">Alamat 2</span>
                      </>
                    ),
                    value: reportPayload.address2,
                  },
                ].map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td
                      className="border p-3 font-semibold align-top w-1/3"
                      style={{
                        borderColor: primaryColor,
                        backgroundColor: tableLabelBg,
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      className="border p-3 align-top"
                      style={{ borderColor: primaryColor }}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className="text-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: secondaryColor }}
            >
              Credit Info at a Glance <span className="italic font-normal">Ringkasan Maklumat Kredit</span>
            </div>

            <table
              className="w-full text-[11px] border-collapse border"
              style={{ borderColor: primaryColor }}
            >
              <thead>
                <tr style={{ backgroundColor: tableHeaderBg }}>
                  <th
                    className="border p-2 text-left font-semibold"
                    style={{ borderColor: primaryColor }}
                  >
                    Credit Info <span className="italic font-normal">Maklumat Kredit</span>
                  </th>
                  <th
                    className="border p-2 text-left font-semibold"
                    style={{ borderColor: primaryColor }}
                  >
                    Source <span className="italic font-normal">Sumber</span>
                  </th>
                  <th
                    className="border p-2 text-left font-semibold"
                    style={{ borderColor: primaryColor }}
                  >
                    Value <span className="italic font-normal">Nilai</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: (
                      <>
                        Bankruptcy Proceedings Record
                        <br />
                        <span className="italic">Rekod Prosiding Kebankrapan</span>
                      </>
                    ),
                    source: 'Newspaper/Gazette',
                    value: 'YES',
                  },
                  {
                    label: (
                      <>
                        Legal records in past 24 months (personal capacity)
                        <br />
                        <span className="italic">
                          Rekod undang-undang dalam tempoh 24 bulan yang lalu
                          (kapasiti peribadi)
                        </span>
                      </>
                    ),
                    source: 'CTOS',
                    value: '0',
                  },
                  {
                    label: (
                      <>
                        Legal records in past 24 months (non-personal capacity)
                        <br />
                        <span className="italic">
                          Rekod undang-undang dalam tempoh 24 bulan yang lalu
                          (kapasiti bukan peribadi)
                        </span>
                      </>
                    ),
                    source: 'CTOS',
                    value: '0',
                  },
                  {
                    label: (
                      <>
                        Availability of Legal Records
                        <br />
                        <span className="italic">Rekod Undang-undang</span>
                      </>
                    ),
                    source: 'BNM',
                    value: 'NO',
                  },
                  {
                    label: (
                      <>
                        Special Attention Accounts
                        <br />
                        <span className="italic">
                          Akaun di bawah Pemerhatian Khas
                        </span>
                      </>
                    ),
                    source: 'BNM',
                    value: 'YES',
                  },
                  {
                    label: (
                      <>
                        Outstanding credit facilities
                        <br />
                        <span className="italic">Kemudahan Kredit Belum Jelas</span>
                      </>
                    ),
                    source: 'BNM',
                    value: '0.00',
                  },
                  {
                    label: (
                      <>
                        Credit applications in past 12 months
                        <br />
                        <span className="italic">
                          Permohonan Kredit dalam tempoh 12 bulan yang lalu
                        </span>
                      </>
                    ),
                    source: 'BNM',
                    value: '0',
                  },
                  {
                    label: (
                      <>
                        Availability of Trade Referee Listing
                        <br />
                        <span className="italic">
                          Rekod Rujukan Perdagangan
                        </span>
                      </>
                    ),
                    source: 'CTOS',
                    value: 'NO',
                  },
                ].map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td
                      className="border p-2 align-top"
                      style={{ borderColor: primaryColor }}
                    >
                      {row.label}
                    </td>
                    <td
                      className="border p-2 align-top"
                      style={{ borderColor: primaryColor }}
                    >
                      {row.source}
                    </td>
                    <td
                      className="border p-2 align-top"
                      style={{ borderColor: primaryColor }}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className="text-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: '#006f82' }}
            >
              eTR Plus at a Glance
            </div>
          </div>

          <div className="lg:w-1/3 p-6 space-y-6 bg-white">
            <div
              className="border bg-white py-6 px-4 relative flex justify-center"
              style={{ borderColor: primaryColor }}
            >
              <img
                src="/lovable-uploads/score.png"
                alt="CTOS Score Gauge"
                className="w-full max-w-xs"
              />
              <svg
                className="absolute top-12 left-1/2 -translate-x-1/2"
                width="320"
                height="170"
                viewBox="0 0 320 170"
              >
                <line
                  x1="160"
                  y1="160"
                  x2="160"
                  y2="30"
                  stroke="#666"
                  strokeWidth="6"
                  strokeLinecap="round"
                  transform={`rotate(${pointerAngle} 160 160)`}
                />
                <circle cx="160" cy="160" r="10" fill="#666" stroke="#fff" strokeWidth="3" />
              </svg>
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-4xl font-bold text-[#1a1a1a]">
                {reportPayload.score}
              </div>
            </div>

            <div
              className="border p-4 bg-white"
              style={{ borderColor: primaryColor }}
            >
              <h3 className="text-sm font-semibold text-[#0f8b9a] uppercase tracking-[0.14em] mb-3">
                What is affecting my Score?
              </h3>
              <p className="text-xs italic text-[#4b5a60] mb-4">
                Apakah yang menjejaskan Skor anda ?
              </p>
              <ol className="list-decimal list-inside space-y-3 text-xs text-[#1f1f1f] leading-relaxed">
                <li>
                  There is serious delinquency (over 90 days past due) or
                  adverse record filed.
                  <br />
                  <span className="italic text-[#444]">
                    Terdapat delinkuensi serius (yang tertunggak melebihi 90
                    hari) atau rekod buruk telah difailkan.
                  </span>
                </li>
                <li>
                  You have a higher number of outstanding loans than the average
                  credit user.
                  <br />
                  <span className="italic text-[#444]">
                    Anda mempunyai bilangan pinjaman tertunggak yang lebih
                    tinggi berbanding dengan purata pengguna kredit.
                  </span>
                </li>
                <li>
                  There is delinquency (past due with no minimum payment) in
                  your credit report.
                  <br />
                  <span className="italic text-[#444]">
                    Terdapat delinkuensi (tunggakan tanpa bayaran minimum) dalam
                    laporan kredit anda.
                  </span>
                </li>
                <li>
                  There is not enough recent account information on your credit
                  report.
                  <br />
                  <span className="italic text-[#444]">
                    Maklumat akaun terkini tidak mencukupi dalam laporan kredit
                    anda.
                  </span>
                </li>
              </ol>
            </div>
        </div>
      </div>

      <div
        className="mx-6 my-3 px-4 py-3 text-[10px] leading-relaxed bg-white border"
        style={{ borderColor: disclaimerColor, color: disclaimerColor }}
      >
          <span className="font-semibold uppercase">Disclaimer:</span>{' '}
          This MyCTOS Report may not be reproduced in whole, in part or in any
          other manner. This report is provided in strict confidence for your
          personal use only. This report contains information compiled from data
          sources which CTOS does not control and which may not have been
          verified unless otherwise stated in this report. In the event of
          ambiguities, conflicts or possible variations in interpretation
          between the English and Malay version of this credit report, the
          English version shall always prevail.
        </div>
      </div>
    </div>
  );
};

export default CTOSReport;
