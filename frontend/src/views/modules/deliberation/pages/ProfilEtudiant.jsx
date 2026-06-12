import React from "react";
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";

const ProfilEtudiant = ({
    data = {},
    param = {} }) => {

    const details = data.mentionSemestreEcueDetails;

     const meansMap = Object.fromEntries(
            (data.means || []).map((e) => [
              e.key,e,])
            );

      const examensMap = Object.fromEntries(
        (data.examens || []).map((e) => [
          e.mentionSemestreEcue.id,e,])
        );

        const annuelsMap = Object.fromEntries(
        (data.annuels || []).map((a) => [
          a.mentionSemestreEcue.id,a,])
        );

        const totalsMap = Object.fromEntries(
        (data.totals || []).map((t) => [
          t.mentionSemestreEcue.id,t,])
        );

        const rattrapagesMap = Object.fromEntries(
            (data.rattrapages || []).map((e) => [
              e.mentionSemestreEcue.id,e,])
        );

         const rattrapageTotalsMap = Object.fromEntries(
            (data.rattrapageTotals || []).map((t) => [
              t.mentionSemestreEcue.id,t,])
            );

         const jury = param.juryMembre?.details;

  return (
    <CCard>
      <CCardBody>

     <div className="text-center mb-1">
       <h5 className="fw-bold mb-0">
         INSTITUT SUPÉRIEUR DAVID DE MBANZA-NGUNGU
       </h5>

       <h6 className="text-uppercase mb-0">
         {param?.mention?.filiere?.domaine?.intitule ?? ""}
       </h6>

       <h6 className="mb-0">
         {(param?.session?.semestre?.semestreName ?? "-").toUpperCase()} (
         S{param?.session?.semestre?.numero ?? "-"}) — Année académique{" "}
         {param?.anneeId ?? "-"}
       </h6>

       <div className="mt-0">
         <strong>MENTION :</strong>{" "}
         {(param?.mention?.mentionName ?? "-").toUpperCase()} (
         {(param?.mention?.filiere?.intitule ?? "-").toUpperCase()})
       </div>

       <div className="my-1">
         <h4 className="fw-bold text-uppercase mb-2">
           Profil de l'étudiant
         </h4>

         <hr
           style={{
             border: "none",
             borderTop: "1px dashed #adb5bd",
             width: "60%",
             margin: "0 auto",
           }}
         />
       </div>
     </div>

        <div className="d-flex justify-content-between mb-3">
          <div>
            <strong>Etudiant :</strong>{" "}
            {`${data?.inscription?.etudiant?.nom ?? ""} ${
              data?.inscription?.etudiant?.postnom ?? ""
            } ${data?.inscription?.etudiant?.prenom ?? ""}`.trim()}

          </div>

          <div>
            <strong>Matricule :</strong>{" "}
              {data?.inscription?.etudiant?.matricule?.trim() || "-"}
          </div>
        </div>

        <CTable bordered responsive small
               className="align-middle mb-0 border"
              style={{
                fontSize: "13px",
                borderColor: "#000",
              }}
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="text-center align-middle" rowSpan={2}>
                Code UE
              </CTableHeaderCell>

              <CTableHeaderCell className="align-middle" rowSpan={2}>
                Unité d'Enseignement
              </CTableHeaderCell>

              <CTableHeaderCell rowSpan={2} className="text-center align-middle">
                Cr
              </CTableHeaderCell>

              <CTableHeaderCell rowSpan={2} className="text-center align-middle" >
                Moy
              </CTableHeaderCell>

              <CTableHeaderCell className="align-middle" rowSpan={2}>
                Éléments Constitutifs
              </CTableHeaderCell>

              <CTableHeaderCell rowSpan={2} className="text-center align-middle">
                Catégorie
              </CTableHeaderCell>

              <CTableHeaderCell rowSpan={2} className="text-center align-middle">
                Cr
              </CTableHeaderCell>

              <CTableHeaderCell colSpan={3} className="text-center" style={{fontSize: "12px"}}>
                SESSION
              </CTableHeaderCell>

              <CTableHeaderCell colSpan={2} className="text-center" style={{fontSize: "12px"}}>
                RATTRAPAGE
              </CTableHeaderCell>

              <CTableHeaderCell rowSpan={2} className="text-center align-middle">
                ETAT
              </CTableHeaderCell>
            </CTableRow>

            <CTableRow className="text-center"
                style={{fontSize: "12px"}}
            >
              <CTableHeaderCell>CC</CTableHeaderCell>
              <CTableHeaderCell>EXA</CTableHeaderCell>
              <CTableHeaderCell>N.FIN</CTableHeaderCell>

              <CTableHeaderCell>EXA</CTableHeaderCell>
              <CTableHeaderCell>N.FIN</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
          {details?.map((row, index) => (
            <CTableRow key={row?.id ?? index}>
              <CTableDataCell className="text-center">{row?.ecue?.ue?.code ?? ""}</CTableDataCell>
              <CTableDataCell>{row?.ecue?.ue?.intitule ?? ""}</CTableDataCell>
              <CTableDataCell className="text-center">{row?.ecue?.ue?.credit ?? 0}</CTableDataCell>
              <CTableDataCell className="text-center">{totalsMap?.[row?.id]?.note?.toFixed(1) ?? 0}</CTableDataCell>
              <CTableDataCell>{row?.ecue?.intitule ?? ""}</CTableDataCell>
              <CTableDataCell className="text-center">{row?.categorie?.intitule ?? ""}</CTableDataCell>
              <CTableDataCell className="text-center">{row?.ecue?.credit ?? 0}</CTableDataCell>
              <CTableDataCell className="text-center">{annuelsMap?.[row?.id]?.note?.toFixed(1) ?? 0}</CTableDataCell>
              <CTableDataCell className="text-center">{examensMap?.[row?.id]?.note?.toFixed(1) ?? 0}</CTableDataCell>
              <CTableDataCell className="text-center">{totalsMap?.[row?.id]?.note?.toFixed(1) ?? 0}</CTableDataCell>
              <CTableDataCell className="text-center">{rattrapagesMap?.[row?.id]?.note?.toFixed(1) ?? ""}</CTableDataCell>
              <CTableDataCell className="text-center">{rattrapageTotalsMap?.[row?.id]?.note?.toFixed(1) ?? ""}</CTableDataCell>
              <CTableDataCell className="text-center">{totalsMap?.[row?.id]?.estValide ? "validé" : "non validé"}</CTableDataCell>
            </CTableRow>
          ))}

            <CTableRow>

               <CTableDataCell colSpan={2}>
                 <strong>MOYENNE DE LA CATEGORIE A</strong>
               </CTableDataCell>

               <CTableDataCell colSpan={2} className="text-center">
                 <strong>{meansMap?.["CAT_A"]?.value?.toFixed(1)}</strong>
               </CTableDataCell>

              <CTableDataCell colSpan={1}>
                <strong>Nombre des crédits capitalisés</strong>
              </CTableDataCell>

             <CTableDataCell colSpan={2} className="text-center">
                 <strong>{data?.deliberation?.valides ?? 0}</strong>
              </CTableDataCell>

              <CTableDataCell  style={{ background: "#343a40" }} colSpan={2}></CTableDataCell>
              <CTableDataCell colSpan={4}>Note</CTableDataCell>
            </CTableRow>

            <CTableRow>
              <CTableDataCell colSpan={2}>
                <strong>MOYENNE DE LA CATEGORIE B</strong>
              </CTableDataCell>

               <CTableDataCell className="text-center" colSpan={2}>
                   <strong>{meansMap?.["CAT_B"]?.value}</strong>
               </CTableDataCell>

              <CTableDataCell colSpan={1}>
                <strong>Nombre des crédits non capitalisés</strong>
              </CTableDataCell>

               <CTableDataCell className="text-center" colSpan={2}>
                   <strong>{data?.deliberation?.transferes ?? 0} </strong>
               </CTableDataCell>

                <CTableDataCell  style={{ background: "#343a40" }} colSpan={2}></CTableDataCell>
                <CTableDataCell colSpan={4}></CTableDataCell>

            </CTableRow>

            <CTableRow>
              <CTableDataCell colSpan={2}>
                <strong>MOYENNE DU {(param?.session?.semestre?.semestreName ?? "-").toUpperCase()}</strong>
              </CTableDataCell>

              <CTableDataCell className="text-center" colSpan={2}>
                <strong>{data?.deliberation?.moyenne}</strong>
              </CTableDataCell>

              <CTableDataCell colSpan={1} className="fw-bold">
                Décision du jury
              </CTableDataCell>

              <CTableDataCell colSpan={4} className="text-center fw-bold">
                   {data?.deliberation?.decision}
              </CTableDataCell>

                <CTableDataCell style={{ background: "#343a40" }} colSpan={4}></CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        <div className="d-flex justify-content-between mt-5">
          <div>
            <strong>Secrétaire du jury</strong>
            <br />
            {(() => {
                const president = jury?.find((j) => j?.role === "PRESIDENT")?.personnel || {};

                const fullName = [
                  president?.nom?.toUpperCase(),
                  president?.postnom?.toUpperCase(),
                ].filter(Boolean).join(" ");

                return fullName || "-";
              })()}
          </div>

          <div className="text-end">
            <strong>Président du Jury</strong>
            <br />
            {(() => {
                const secretaire = jury?.find((j) => j?.role === "SECRETAIRE")?.personnel || {};

                const fullName = [
                  secretaire?.nom?.toUpperCase(),
                  secretaire?.postnom?.toUpperCase(),
                ].filter(Boolean).join(" ");

                return fullName || "-";
              })()}
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default ProfilEtudiant;