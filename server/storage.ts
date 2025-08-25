
<old_str>export const storage = {
  users: [] as User[],
  projects: [] as Project[],
  bids: [] as Bid[],

  // User methods
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const user: User = {
      id: `user_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };
    storage.users.push(user);
    return user;
  },

  getUser: (id: string) => storage.users.find(u => u.id === id),
  getUsers: () => storage.users,

  // Project methods
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const project: Project = {
      id: `project_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...projectData
    };
    storage.projects.push(project);
    return project;
  },

  getProject: (id: string) => storage.projects.find(p => p.id === id),
  getProjects: () => storage.projects,
  updateProject: (id: string, updates: Partial<Project>) => {
    const index = storage.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      storage.projects[index] = { ...storage.projects[index], ...updates, updatedAt: new Date() };
      return storage.projects[index];
    }
    return null;
  },

  // Bid methods
  createBid: (bidData: Omit<Bid, 'id' | 'createdAt' | 'updatedAt'>) => {
    const bid: Bid = {
      id: `bid_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...bidData
    };
    storage.bids.push(bid);
    return bid;
  },

  getBid: (id: string) => storage.bids.find(b => b.id === id),
  getBids: () => storage.bids,
  updateBidStatus: (id: string, status: BidStatus) => {
    const bid = storage.bids.find(b => b.id === id);
    if (bid) {
      bid.status = status;
      bid.updatedAt = new Date();
    }
    return bid;
  }
};</old_str>
<new_str>export const storage = {
  users: [] as User[],
  projects: [] as Project[],
  bids: [] as Bid[],
  projectStandardizations: [] as any[],
  webSources: [] as any[],
  webDocs: [] as any[],
  externalCompanies: [] as any[],
  externalCompanySignals: [] as any[],
  sourcingMatches: [] as any[],
  projectChangeLogs: [] as any[],

  // User methods
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const user: User = {
      id: `user_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };
    storage.users.push(user);
    return user;
  },

  getUser: (id: string) => storage.users.find(u => u.id === id),
  getUsers: () => storage.users,

  // Project methods
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const project: Project = {
      id: `project_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...projectData
    };
    storage.projects.push(project);
    return project;
  },

  getProject: (id: string) => storage.projects.find(p => p.id === id),
  getProjects: () => storage.projects,
  updateProject: (id: string, updates: Partial<Project>) => {
    const index = storage.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      storage.projects[index] = { ...storage.projects[index], ...updates, updatedAt: new Date() };
      return storage.projects[index];
    }
    return null;
  },

  // Bid methods
  createBid: (bidData: Omit<Bid, 'id' | 'createdAt' | 'updatedAt'>) => {
    const bid: Bid = {
      id: `bid_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...bidData
    };
    storage.bids.push(bid);
    return bid;
  },

  getBid: (id: string) => storage.bids.find(b => b.id === id),
  getBids: () => storage.bids,
  updateBidStatus: (id: string, status: BidStatus) => {
    const bid = storage.bids.find(b => b.id === id);
    if (bid) {
      bid.status = status;
      bid.updatedAt = new Date();
    }
    return bid;
  },

  // ProjectStandardization methods
  saveProjectStandardization: (standardization: any) => {
    const existing = storage.projectStandardizations.findIndex(s => s.projectId === standardization.projectId);
    if (existing !== -1) {
      storage.projectStandardizations[existing] = standardization;
    } else {
      storage.projectStandardizations.push(standardization);
    }
    return standardization;
  },

  getProjectStandardization: (projectId: string) => 
    storage.projectStandardizations.find(s => s.projectId === projectId),

  updateProjectStandardization: (projectId: string, updates: any) => {
    const index = storage.projectStandardizations.findIndex(s => s.projectId === projectId);
    if (index !== -1) {
      storage.projectStandardizations[index] = { 
        ...storage.projectStandardizations[index], 
        ...updates, 
        updatedAt: new Date() 
      };
      return storage.projectStandardizations[index];
    }
    return null;
  },

  // WebSource methods
  saveWebSource: (source: any) => {
    storage.webSources.push(source);
    return source;
  },

  getWebSources: () => storage.webSources,
  getWebSource: (id: string) => storage.webSources.find(s => s.id === id),

  // WebDoc methods
  saveWebDoc: (doc: any) => {
    storage.webDocs.push(doc);
    return doc;
  },

  getWebDocs: () => storage.webDocs,
  getWebDoc: (id: string) => storage.webDocs.find(d => d.id === id),

  // ExternalCompany methods
  saveExternalCompany: (company: any) => {
    const existing = storage.externalCompanies.findIndex(c => 
      c.name === company.name || (c.email && c.email === company.email)
    );
    
    if (existing !== -1) {
      // Mise à jour de la dernière vue
      storage.externalCompanies[existing] = {
        ...storage.externalCompanies[existing],
        ...company,
        lastSeenAt: new Date(),
        updatedAt: new Date()
      };
      return storage.externalCompanies[existing];
    } else {
      company.id = `ext_company_${Date.now()}`;
      company.createdAt = new Date();
      company.updatedAt = new Date();
      storage.externalCompanies.push(company);
      return company;
    }
  },

  getExternalCompany: (id: string) => storage.externalCompanies.find(c => c.id === id),
  getExternalCompanies: () => storage.externalCompanies,

  // ExternalCompanySignal methods
  saveExternalCompanySignal: (signal: any) => {
    signal.id = `signal_${Date.now()}`;
    signal.createdAt = new Date();
    storage.externalCompanySignals.push(signal);
    return signal;
  },

  getExternalCompanySignals: (companyId: string) => 
    storage.externalCompanySignals.filter(s => s.companyId === companyId),

  // SourcingMatch methods
  saveSourcingMatch: (match: any) => {
    const existing = storage.sourcingMatches.findIndex(m => 
      m.projectId === match.projectId && m.companyId === match.companyId
    );
    
    if (existing !== -1) {
      storage.sourcingMatches[existing] = {
        ...storage.sourcingMatches[existing],
        ...match,
        updatedAt: new Date()
      };
      return storage.sourcingMatches[existing];
    } else {
      match.id = `match_${Date.now()}`;
      match.createdAt = new Date();
      match.updatedAt = new Date();
      storage.sourcingMatches.push(match);
      return match;
    }
  },

  getSourcingMatches: (projectId: string, filters: any = {}) => {
    let matches = storage.sourcingMatches.filter(m => m.projectId === projectId);
    
    if (filters.minScore) {
      matches = matches.filter(m => m.leadScore >= filters.minScore);
    }
    
    if (filters.status) {
      matches = matches.filter(m => m.status === filters.status);
    }
    
    // Tri par score décroissant
    matches.sort((a, b) => b.leadScore - a.leadScore);
    
    if (filters.limit) {
      matches = matches.slice(0, filters.limit);
    }
    
    return matches;
  },

  // ProjectChangeLog methods
  saveProjectChangeLog: (log: any) => {
    storage.projectChangeLogs.push(log);
    return log;
  },

  getProjectChangeLogs: (projectId: string) => 
    storage.projectChangeLogs.filter(l => l.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
};</new_str>
