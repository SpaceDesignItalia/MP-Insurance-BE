const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const FileGeneratorModel = require("../Models/FileGeneratorModel");
const archiver = require("archiver");

class FileGeneratorController {
  static async getMonthPolicyExcel(req, res, db) {
    try {
      const type = req.query.type;

      if (!type) {
        return res.status(400).send("Parametro query 'type' mancante.");
      }

      // Recupera tutte le polizze che scadono questo mese
      const policies = await FileGeneratorModel.getPoliciesExpiringThisMonth(
        db
      );

      if (!Array.isArray(policies)) {
        console.log(policies);
        throw new Error("Le polizze recuperate non sono un array.");
      }

      // Filtra le polizze per durata di 12 mesi e 6 mesi
      const policies12Months = policies.filter(
        (policy) => policy.duration === 12
      );
      const policies6Months = policies.filter(
        (policy) => policy.duration === 6
      );

      // Funzione per formattare le date
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Funzione per generare il file Excel
      const generateExcelFile = async (filename, policies) => {
        if (policies.length === 0) {
          console.log(`Nessun dato per ${filename}`);
          return null; // Non generare file se non ci sono dati
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Polizze");

        worksheet.columns = [
          { header: "ID Polizza", key: "policyId" },
          { header: "Nome Completo", key: "fullName" },
          { header: "Telefono", key: "phoneNumber" },
          { header: "Email", key: "email" },
          { header: "Frazionamento", key: "duration" },
          { header: "Data Inizio", key: "startDate" },
          { header: "Data Scadenza", key: "endDate" },
          { header: "Veicolo", key: "vehicle" },
          { header: "Targa", key: "licensePlate" },
          { header: "Compagnia", key: "companyName" },
          { header: "Tipologie", key: "types" },
          { header: "Stato Pagamento", key: "paymentStatus" },
          { header: "Stato Polizza", key: "status" },
        ];

        policies.forEach((policy) => {
          worksheet.addRow({
            policyId: policy.policyId,
            fullName: policy.fullName,
            phoneNumber: policy.phoneNumber,
            email: policy.email,
            duration: policy.duration === 12 ? "Annuale" : "Semestrale",
            startDate: formatDate(new Date(policy.startDate)),
            endDate: formatDate(new Date(policy.endDate)),
            vehicle: `${policy.brand} ${policy.model}`,
            licensePlate: policy.licensePlate,
            companyName: policy.companyName,
            types: policy.types.join(", "),
            paymentStatus: policy.paymentStatus,
            status: policy.status,
          });
        });

        const filePath = path.join(__dirname, "..", "temp", filename);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
      };

      // Crea i file Excel per le durate che hanno dati
      const filePath12Months =
        policies12Months.length > 0
          ? await generateExcelFile("Polizze_12_Mesi.xlsx", policies12Months)
          : null;
      const filePath6Months =
        policies6Months.length > 0
          ? await generateExcelFile("Polizze_6_Mesi.xlsx", policies6Months)
          : null;

      // Gestisci le richieste per i file
      if (type === "12") {
        if (filePath12Months) {
          res.download(filePath12Months, (err) => {
            if (err) {
              console.error("Errore durante il download del file:", err);
              res.status(500).send("Errore durante il download del file");
            } else {
              fs.unlink(filePath12Months, (err) => {
                if (err)
                  console.error("Errore durante l'eliminazione del file:", err);
              });
            }
          });
        } else {
          res
            .status(404)
            .send("Nessun dato disponibile per le polizze di 12 mesi.");
        }
      } else if (type === "6") {
        if (filePath6Months) {
          res.download(filePath6Months, (err) => {
            if (err) {
              console.error("Errore durante il download del file:", err);
              res.status(500).send("Errore durante il download del file");
            } else {
              fs.unlink(filePath6Months, (err) => {
                if (err)
                  console.error("Errore durante l'eliminazione del file:", err);
              });
            }
          });
        } else {
          res
            .status(404)
            .send("Nessun dato disponibile per le polizze di 6 mesi.");
        }
      } else if (type === "both") {
        const zip = archiver("zip");
        res.setHeader(
          "Content-disposition",
          "attachment; filename=policies.zip"
        );
        res.setHeader("Content-type", "application/zip");

        const archive = zip.pipe(res);

        if (filePath12Months) {
          archive.file(filePath12Months, {
            name: path.basename(filePath12Months),
          });
        }
        if (filePath6Months) {
          archive.file(filePath6Months, {
            name: path.basename(filePath6Months),
          });
        }
        archive.finalize();

        // Elimina i file temporanei se esistono
        if (filePath12Months) {
          fs.unlink(filePath12Months, (err) => {
            if (err)
              console.error("Errore durante l'eliminazione del file:", err);
          });
        }
        if (filePath6Months) {
          fs.unlink(filePath6Months, (err) => {
            if (err)
              console.error("Errore durante l'eliminazione del file:", err);
          });
        }
      } else {
        res.status(400).send("Parametro query 'type' non valido.");
      }
    } catch (error) {
      console.error("Errore nel recupero delle polizze:", error);
      res.status(500).send("Recupero delle polizze fallito");
    }
  }
}

module.exports = FileGeneratorController;
