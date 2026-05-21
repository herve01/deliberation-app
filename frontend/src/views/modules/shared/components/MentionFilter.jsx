import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CBadge,
  CInputGroup,
  CInputGroupText
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilFilter,
  cilCalendar,
  cilLibrary,
  cilEducation,
  cilSchool,
  cilReload
} from "@coreui/icons";

import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";

export default function MentionFilter({ onFilter }) {

  const [visible,setVisible]=useState(false);
  const [loading,setLoading]=useState(false);

  const [annees,setAnnees]=useState([]);
  const [domaines,setDomaines]=useState([]);
  const [filieres,setFilieres]=useState([]);
  const [mentions,setMentions]=useState([]);

  const initialForm = {
      anneeId:"",
      domaineId:"",
      filiereId:"",
      mentionId:""
  };

  const [form,setForm]=useState(initialForm);

  useEffect(()=>{

      if(!visible) return;

      loadInitial();

  },[visible]);

  const loadInitial = async()=>{

      setLoading(true);

      try{

          const [
              a,
              d
          ]=await Promise.all([
              anneeService.getAll(),
              domaineService.getAll()
          ]);

          setAnnees(a||[]);
          setDomaines(d||[]);

      }finally{

          setLoading(false);

      }

  };


  useEffect(()=>{

      if(!form.domaineId){
          setFilieres([]);
          return;
      }

      loadFilieres();

  },[form.domaineId]);


  const loadFilieres = async()=>{

      const data =
          await filiereService.getByDomaine(
              form.domaineId
          );

      setFilieres(data||[]);
  };


  useEffect(()=>{

      if(!form.filiereId){
          setMentions([]);
          return;
      }

      loadMentions();

  },[form.filiereId]);


  const loadMentions = async()=>{

      const data =
          await mentionService.getByFiliere(
              form.filiereId
          );

      setMentions(data||[]);
  };


  const handleChange=(field)=>(e)=>{

      let value=e.target.value;

      setForm(prev=>({

          ...prev,

          [field]:value,

          ...(field==="domaineId"
            ? {filiereId:"",mentionId:""}
            : {}),

          ...(field==="filiereId"
            ? {mentionId:""}
            : {})
      }));

  };


  const reset=()=>{

      setForm(initialForm);
      setFilieres([]);
      setMentions([]);

  };


  const closeModal=()=>{

      reset();
      setVisible(false);

  };


  const handleSubmit=(e)=>{

      e.preventDefault();

      onFilter?.(form);

      closeModal();

  };


  return (

<>
<CButton
    variant="outline"
    onClick={()=>setVisible(true)}
>

<CIcon icon={cilFilter} className="me-2"/>

</CButton>


<CModal
visible={visible}
size="xl"
alignment="center"
onClose={closeModal}
>

<CModalHeader>

<CModalTitle>

<CIcon
icon={cilFilter}
className="me-2"
/>

Filtrer étudiants

</CModalTitle>

</CModalHeader>


<CModalBody>

<CCard className="shadow-sm border-0">

<CCardBody>

{
loading
?

<div className="text-center p-5">

<CSpinner/>

</div>

:

<CForm onSubmit={handleSubmit}>

<CRow className="g-3">

{/* Année */}

<CCol md={6} lg={3}>

<CFormLabel>Année</CFormLabel>

<CInputGroup>

<CInputGroupText>
<CIcon icon={cilCalendar}/>
</CInputGroupText>

<CFormSelect
value={form.anneeId}
onChange={handleChange("anneeId")}
>

<option>Sélectionner</option>

{
annees.map(a=>(

<option key={a.id} value={a.id}>
{a.annee}
</option>

))
}

</CFormSelect>

</CInputGroup>

</CCol>


{/* Domaine */}

<CCol md={6} lg={3}>

<CFormLabel>Domaine</CFormLabel>

<CInputGroup>

<CInputGroupText>
<CIcon icon={cilLibrary}/>
</CInputGroupText>

<CFormSelect
value={form.domaineId}
onChange={handleChange("domaineId")}
>

<option>Sélectionner</option>

{
domaines.map(d=>(

<option key={d.id} value={d.id}>
{d.intitule}
</option>

))
}

</CFormSelect>

</CInputGroup>

</CCol>


{/* Filière */}

<CCol md={6} lg={3}>

<CFormLabel>Filière</CFormLabel>

<CInputGroup>

<CInputGroupText>
<CIcon icon={cilEducation}/>
</CInputGroupText>

<CFormSelect
disabled={!form.domaineId}
value={form.filiereId}
onChange={handleChange("filiereId")}
>

<option>Sélectionner</option>

{
filieres.map(f=>(

<option key={f.id} value={f.id}>
{f.intitule}
</option>

))
}

</CFormSelect>

</CInputGroup>

</CCol>


{/* Mention */}

<CCol md={6} lg={3}>

<CFormLabel>Mention</CFormLabel>

<CInputGroup>

<CInputGroupText>
<CIcon icon={cilSchool}/>
</CInputGroupText>

<CFormSelect
disabled={!form.filiereId}
value={form.mentionId}
onChange={handleChange("mentionId")}
>

<option>Sélectionner</option>

{
mentions.map(m=>(

<option key={m.id} value={m.id}>
{m.intitule}
</option>

))
}

</CFormSelect>

</CInputGroup>

</CCol>

</CRow>


<div className="d-flex justify-content-end gap-2 mt-4">

<CButton
color="secondary"
onClick={closeModal}
>

Fermer

</CButton>


<CButton
type="submit"
color="primary"
disabled={
!Object.values(form)
.filter(Boolean)
.length
}
>

Valider

</CButton>

</div>

</CForm>

}

</CCardBody>

</CCard>

</CModalBody>

</CModal>

</>

);

}