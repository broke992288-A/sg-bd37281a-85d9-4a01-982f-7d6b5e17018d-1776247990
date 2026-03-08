import { supabase } from "@/integrations/supabase/client";

const UZBEK_NAMES_MALE = [
  "Abdulloh", "Bobur", "Doniyor", "Elmurod", "Farrux", "G'ayrat", "Husan", "Islom", "Jasur",
  "Kamol", "Laziz", "Mirzo", "Nodir", "Otabek", "Parviz", "Rustam", "Sanjar", "Temur",
  "Ulug'bek", "Vohid", "Xurshid", "Yorqin", "Zafar", "Sardor", "Sherzod", "Behruz",
];
const UZBEK_NAMES_FEMALE = [
  "Aziza", "Barno", "Dilnoza", "Feruza", "Gulnora", "Hilola", "Iroda", "Kamola",
  "Lobar", "Malika", "Nafisa", "Oygul", "Parizod", "Sabohat", "Tabassum", "Zulfiya",
];
const SURNAMES = [
  "Karimov", "Rahimov", "Toshmatov", "Xolmatov", "Ergashev", "Mirzayev", "Umarov",
  "Yusupov", "Abdullayev", "Botirov", "Sultonov", "Qodirov", "Nazarov", "Ismoilov",
];
const REGIONS = [
  "Toshkent shahri", "Toshkent viloyati", "Samarqand viloyati", "Buxoro viloyati",
  "Farg'ona viloyati", "Andijon viloyati", "Namangan viloyati", "Qashqadaryo viloyati",
  "Surxondaryo viloyati", "Xorazm viloyati", "Navoiy viloyati", "Jizzax viloyati",
];
const MEDICATIONS = [
  { name: "Tacrolimus", dosages: ["0.5 mg", "1 mg", "2 mg", "5 mg"] },
  { name: "Mycophenolate", dosages: ["250 mg", "500 mg", "1000 mg"] },
  { name: "Prednisolone", dosages: ["5 mg", "10 mg", "20 mg"] },
  { name: "Cyclosporine", dosages: ["25 mg", "50 mg", "100 mg"] },
  { name: "Azathioprine", dosages: ["50 mg", "75 mg", "100 mg"] },
  { name: "Sirolimus", dosages: ["1 mg", "2 mg"] },
  { name: "Valganciclovir", dosages: ["450 mg", "900 mg"] },
  { name: "Cotrimoxazole", dosages: ["480 mg", "960 mg"] },
];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min: number, max: number, decimals = 1): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
}
function randDate(startYear: number, endYear: number): string {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10);
}

export interface DemoProgress {
  step: string;
  current: number;
  total: number;
}

/** Insert rows in batches, returning inserted rows with ids */
async function batchInsert(
  table: "patients" | "lab_results" | "patient_alerts" | "medications",
  rows: Record<string, any>[],
  batchSize: number,
  onBatch?: (done: number) => void,
): Promise<{ id: string }[]> {
  const allInserted: { id: string }[] = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await (supabase
      .from(table)
      .insert(batch as any)
      .select("id") as any);
    if (error) throw new Error(`${table} batch insert: ${error.message}`);
    if (data) allInserted.push(...(data as { id: string }[]));
    onBatch?.(Math.min(i + batchSize, rows.length));
  }
  return allInserted;
}

/** Insert rows in batches without returning data (faster) */
async function batchInsertNoReturn(
  table: "patients" | "lab_results" | "patient_alerts" | "medications",
  rows: Record<string, any>[],
  batchSize: number,
  onBatch?: (done: number) => void,
): Promise<number> {
  let count = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await (supabase.from(table).insert(batch as any) as any);
    if (!error) count += batch.length;
    onBatch?.(Math.min(i + batchSize, rows.length));
  }
  return count;
}

export async function generateDemoData(
  doctorId: string,
  onProgress?: (p: DemoProgress) => void
): Promise<{ patients: number; labs: number; alerts: number; medications: number }> {
  const patientCount = 50;
  const labsPerPatient = 4;
  const alertCount = 20;
  const medsPerPatient = 2;

  // 1. Build all patient rows
  const patientRows = Array.from({ length: patientCount }, () => {
    const isMale = Math.random() > 0.4;
    const name = isMale ? rand(UZBEK_NAMES_MALE) : rand(UZBEK_NAMES_FEMALE);
    const surname = rand(SURNAMES);
    const organ = Math.random() > 0.4 ? "kidney" : "liver";
    const risk = Math.random() < 0.15 ? "high" : Math.random() < 0.4 ? "medium" : "low";
    return {
      full_name: `${name} ${isMale ? surname : surname + "a"}`,
      date_of_birth: randDate(1950, 2005),
      gender: isMale ? "male" : "female",
      organ_type: organ,
      risk_level: risk,
      assigned_doctor_id: doctorId,
      transplant_number: Math.random() > 0.8 ? 2 : 1,
      transplant_date: randDate(2018, 2026),
      dialysis_history: organ === "kidney" ? Math.random() > 0.6 : false,
      region: rand(REGIONS),
    };
  });

  // Batch insert patients (10 per batch)
  onProgress?.({ step: "patients", current: 0, total: patientCount });
  const inserted = await batchInsert("patients", patientRows, 10, (done) => {
    onProgress?.({ step: "patients", current: done, total: patientCount });
  });
  const patientIds = inserted.map((r) => r.id);

  // 2. Build all lab result rows
  const labRows: Record<string, any>[] = [];
  for (let i = 0; i < patientIds.length; i++) {
    const pid = patientIds[i];
    const isKidney = patientRows[i].organ_type === "kidney";
    for (let j = 0; j < labsPerPatient; j++) {
      const recorded = new Date();
      recorded.setDate(recorded.getDate() - (j * 30 + Math.floor(Math.random() * 10)));
      const lab: Record<string, any> = { patient_id: pid, recorded_at: recorded.toISOString() };
      if (isKidney) {
        lab.creatinine = randNum(0.8, 4.0);
        lab.egfr = randNum(15, 120, 0);
        lab.potassium = randNum(3.0, 6.5);
        lab.proteinuria = randNum(0, 3.0);
        lab.sodium = randNum(130, 150, 0);
        lab.hb = randNum(8, 16);
      } else {
        lab.tacrolimus_level = randNum(2, 25);
        lab.alt = randNum(10, 300, 0);
        lab.ast = randNum(10, 250, 0);
        lab.total_bilirubin = randNum(0.2, 8);
        lab.direct_bilirubin = randNum(0.1, 4);
        lab.albumin = randNum(2.5, 5.0);
      }
      labRows.push(lab);
    }
  }

  // Batch insert labs (20 per batch)
  onProgress?.({ step: "labs", current: 0, total: labRows.length });
  const labCount = await batchInsertNoReturn("lab_results", labRows, 20, (done) => {
    onProgress?.({ step: "labs", current: done, total: labRows.length });
  });

  // 3. Build alert rows
  const alertTypes = ["risk", "medication", "lab_abnormal", "follow_up"];
  const severities = ["critical", "warning", "info"];
  const titles = [
    "Yuqori xavf aniqlandi", "Dori dozasi tekshirilsin", "Laboratoriya og'ishi",
    "Nazorat tekshiruvi kerak", "Rejektsiya ehtimoli", "Tacrolimus norma tashqarida",
  ];
  const alertRows = Array.from({ length: Math.min(alertCount, patientIds.length) }, (_, i) => ({
    patient_id: patientIds[i % patientIds.length],
    alert_type: rand(alertTypes),
    severity: rand(severities),
    title: rand(titles),
    message: "Demo alert — avtomatik yaratilgan",
    is_read: Math.random() > 0.7,
  }));

  onProgress?.({ step: "alerts", current: 0, total: alertRows.length });
  const alertsCreated = await batchInsertNoReturn("patient_alerts", alertRows, 20, (done) => {
    onProgress?.({ step: "alerts", current: done, total: alertRows.length });
  });

  // 4. Build medication rows
  const medRows: Record<string, any>[] = [];
  for (let i = 0; i < patientIds.length; i++) {
    for (let m = 0; m < medsPerPatient; m++) {
      const med = rand(MEDICATIONS);
      medRows.push({
        patient_id: patientIds[i],
        medication_name: med.name,
        dosage: rand(med.dosages),
        frequency: rand(["daily", "twice_daily", "three_times"]),
        start_date: randDate(2023, 2026),
        prescribed_by: doctorId,
        is_active: Math.random() > 0.2,
      });
    }
  }

  onProgress?.({ step: "medications", current: 0, total: medRows.length });
  const medsCreated = await batchInsertNoReturn("medications", medRows, 20, (done) => {
    onProgress?.({ step: "medications", current: done, total: medRows.length });
  });

  return { patients: patientIds.length, labs: labCount, alerts: alertsCreated, medications: medsCreated };
}
