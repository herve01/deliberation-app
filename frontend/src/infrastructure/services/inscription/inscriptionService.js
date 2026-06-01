import api from "@src/infrastructure/services/commonService";

const entity = "inscriptions";

export default {
    // -------------------------
    // CRUD
    // -------------------------

    // GET /api/inscriptions
    getAll: () => api.getAll(entity),

    // GET /api/inscriptions/{id}
    getById: (id) => api.get(entity, id),

    // POST /api/inscriptions
    add: (dto) => api.add(entity, dto),

    // PUT /api/inscriptions/{id}
    update: (id, dto) => api.update(entity, id, dto),

    // DELETE /api/inscriptions/{id}
    delete: (id) => api.remove(entity, id),

    // GET /liste/{type}/{id}
    getAllByTypeId: (type, id) => api.getAll(entity, { path: `liste/${type}/${id}`,}),

    // GET /annee/{anneeId}/mention/{mentionId}
    getAllByAnneeMention: (anneeId, mentionId) => api.getAll(entity, {path: `annee/${anneeId}/mention/${mentionId}`,}),

    // GET /etudiant/{etudiantId}/annee/{anneeId}
    getByEtudiantAnnee: (etudiantId, anneeId) => api.getAll(entity, { path: `etudiant/${etudiantId}/annee/${anneeId}`,}),

    // GET /etudiant/{etudiantId}/annee/{anneeId}/mention/{mentionId}
    getByEtudiantAnneeMention: (etudiantId, anneeId, mentionId) => api.get(entity, { path: `etudiant/${etudiantId}/annee/${anneeId}/mention/${mentionId}`,}),

    // POST /add_all
    addWithEtudiant: (dto) => api.add(`${entity}/add_all`, dto),

    // PUT /api/inscriptions/{id}
    updateWithEtudiant: (id, dto) => api.update(`${entity}/update_all`, id, dto),

    // GET /annee/{anneeId}/dashboard
    getInscriptionDashboard: (anneeId) => api.get(entity, { path: `annee/${anneeId}/dashboard`,}),
};