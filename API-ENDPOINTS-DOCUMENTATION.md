# Cognitiva Analytics - Documentação de Endpoints da API

## Visão Geral

Este documento descreve todos os endpoints da API necessários para o funcionamento do frontend Cognitiva Analytics. 
Os endpoints estão organizados por domínio e incluem os formatos de requisição e resposta esperados.

**Base URL:** `https://api.cognitiva.com.br/v1`

**Autenticação:** Bearer Token (JWT)

**Content-Type:** `application/json`

---

## Índice

1. [Máquinas](#1-máquinas)
2. [Localizações/Workspaces](#2-localizaçõesworkspaces)
3. [Funcionários](#3-funcionários)
4. [Equipe](#4-equipe)
5. [Tarefas (Kanban)](#5-tarefas-kanban)
6. [Relatórios](#6-relatórios)
7. [Inventário](#7-inventário)
8. [Fornecedores (Peças)](#8-fornecedores-peças)
9. [AWS Bedrock - Renderização 3D](#9-aws-bedrock---renderização-3d)
10. [Dashboard](#10-dashboard)
11. [Monitoramento em Tempo Real](#11-monitoramento-em-tempo-real)

---

## 1. Máquinas

### GET /api/machines

Retorna lista de todas as máquinas cadastradas.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| status | string | Não | Filtrar por status: `operational`, `warning`, `critical`, `maintenance` |
| type | string | Não | Filtrar por tipo de máquina |
| location | string | Não | Filtrar por localização |
| page | number | Não | Página para paginação (default: 1) |
| limit | number | Não | Itens por página (default: 20) |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "machines": [
      {
        "id": "machine-1",
        "name": "Bomba Centrífuga BC-2000",
        "model": "BC-2000",
        "type": "centrifugal-pump",
        "status": "operational",
        "location": "Setor A - Linha 1",
        "lastMaintenance": "2025-11-10",
        "nextMaintenance": "2026-02-08",
        "efficiency": 94,
        "metrics": {
          "temperature": 65,
          "temperatureStatus": "normal",
          "vibration": 2.1,
          "vibrationStatus": "normal",
          "pressure": 8.5,
          "pressureStatus": "normal",
          "runtime": 156,
          "runtimeHours": 3744
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
\`\`\`

### GET /api/machines/:id

Retorna detalhes de uma máquina específica.

**Path Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| id | string | ID único da máquina |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "machine-1",
    "name": "Bomba Centrífuga BC-2000",
    "model": "BC-2000",
    "type": "centrifugal-pump",
    "serialNumber": "BC2000-2024-001234",
    "manufacturer": "Industrial Pumps Co.",
    "installationDate": "2023-06-15",
    "status": "operational",
    "location": {
      "id": "loc-1",
      "name": "Setor A - Linha 1",
      "address": "Rua Industrial, 500",
      "coordinates": {
        "lat": -23.5505,
        "lng": -46.6333
      }
    },
    "lastMaintenance": "2025-11-10",
    "nextMaintenance": "2026-02-08",
    "efficiency": 94,
    "metrics": {
      "temperature": {
        "value": 65,
        "unit": "°C",
        "status": "normal",
        "min": 20,
        "max": 85,
        "threshold": {
          "warning": 75,
          "critical": 85
        }
      },
      "vibration": {
        "value": 2.1,
        "unit": "mm/s",
        "status": "normal",
        "min": 0,
        "max": 10,
        "threshold": {
          "warning": 4.5,
          "critical": 7.0
        }
      },
      "pressure": {
        "value": 8.5,
        "unit": "bar",
        "status": "normal",
        "min": 0,
        "max": 15,
        "threshold": {
          "warning": 12,
          "critical": 14
        }
      },
      "rpm": {
        "value": 1750,
        "unit": "RPM",
        "status": "normal"
      },
      "powerConsumption": {
        "value": 45.2,
        "unit": "kW",
        "status": "efficient"
      },
      "runtime": 156,
      "runtimeHours": 3744
    },
    "components": [
      {
        "id": "comp-1",
        "name": "Rolamento Principal",
        "type": "bearing",
        "status": "normal",
        "healthScore": 92,
        "lastReplacement": "2024-08-15",
        "estimatedLifeRemaining": "18 meses"
      },
      {
        "id": "comp-2",
        "name": "Selo Mecânico",
        "type": "seal",
        "status": "warning",
        "healthScore": 68,
        "lastReplacement": "2023-12-01",
        "estimatedLifeRemaining": "3 meses"
      }
    ],
    "maintenanceHistory": [
      {
        "id": "mh-1",
        "date": "2025-11-10",
        "type": "preventive",
        "description": "Troca de óleo e filtros",
        "technician": "Carlos Oliveira",
        "cost": 850.00
      }
    ],
    "documents": [
      {
        "id": "doc-1",
        "name": "Manual Técnico",
        "type": "pdf",
        "url": "/documents/bc-2000-manual.pdf"
      }
    ],
    "images": [
      {
        "id": "img-1",
        "url": "/images/machines/bc-2000.jpg",
        "caption": "Vista frontal"
      }
    ],
    "model3dUrl": "/models/centrifugal-pump.glb"
  }
}
\`\`\`

### GET /api/machines/:id/analysis

Retorna análise detalhada com insights de IA para uma máquina.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "machineId": "machine-1",
    "machineName": "Bomba Centrífuga BC-2000",
    "analysisDate": "2025-11-20T14:30:00Z",
    "overallHealth": {
      "score": 94,
      "status": "excellent",
      "trend": "stable"
    },
    "aiInsights": {
      "summary": "A máquina está operando dentro dos parâmetros normais. Pequena elevação de temperatura detectada, mas dentro dos limites aceitáveis.",
      "riskLevel": "low",
      "confidenceScore": 0.94,
      "predictions": [
        {
          "type": "maintenance",
          "component": "Selo Mecânico",
          "description": "Recomenda-se substituição preventiva do selo mecânico",
          "probability": 0.78,
          "estimatedDate": "2026-01-15",
          "impact": "medium",
          "recommendedActions": [
            "Agendar manutenção preventiva",
            "Verificar estoque de peça de reposição",
            "Preparar plano de contingência"
          ]
        }
      ],
      "anomalies": [
        {
          "id": "anom-1",
          "detectedAt": "2025-11-18T08:45:00Z",
          "type": "temperature_spike",
          "severity": "low",
          "description": "Pico de temperatura de 78°C detectado às 08:45",
          "resolved": true,
          "resolvedAt": "2025-11-18T09:15:00Z"
        }
      ],
      "efficiencyAnalysis": {
        "currentEfficiency": 94,
        "optimalEfficiency": 98,
        "efficiencyGap": 4,
        "potentialSavings": {
          "energy": "12 kWh/dia",
          "cost": "R$ 450/mês"
        },
        "improvementSuggestions": [
          "Ajustar velocidade de rotação para carga atual",
          "Verificar alinhamento do acoplamento",
          "Limpar filtros de entrada"
        ]
      }
    },
    "metricsHistory": {
      "period": "7days",
      "temperature": [
        { "timestamp": "2025-11-14T00:00:00Z", "value": 62 },
        { "timestamp": "2025-11-15T00:00:00Z", "value": 64 },
        { "timestamp": "2025-11-16T00:00:00Z", "value": 63 },
        { "timestamp": "2025-11-17T00:00:00Z", "value": 65 },
        { "timestamp": "2025-11-18T00:00:00Z", "value": 78 },
        { "timestamp": "2025-11-19T00:00:00Z", "value": 66 },
        { "timestamp": "2025-11-20T00:00:00Z", "value": 65 }
      ],
      "vibration": [
        { "timestamp": "2025-11-14T00:00:00Z", "value": 2.0 },
        { "timestamp": "2025-11-15T00:00:00Z", "value": 2.1 },
        { "timestamp": "2025-11-16T00:00:00Z", "value": 2.0 },
        { "timestamp": "2025-11-17T00:00:00Z", "value": 2.2 },
        { "timestamp": "2025-11-18T00:00:00Z", "value": 2.3 },
        { "timestamp": "2025-11-19T00:00:00Z", "value": 2.1 },
        { "timestamp": "2025-11-20T00:00:00Z", "value": 2.1 }
      ],
      "efficiency": [
        { "timestamp": "2025-11-14T00:00:00Z", "value": 93 },
        { "timestamp": "2025-11-15T00:00:00Z", "value": 94 },
        { "timestamp": "2025-11-16T00:00:00Z", "value": 94 },
        { "timestamp": "2025-11-17T00:00:00Z", "value": 93 },
        { "timestamp": "2025-11-18T00:00:00Z", "value": 91 },
        { "timestamp": "2025-11-19T00:00:00Z", "value": 94 },
        { "timestamp": "2025-11-20T00:00:00Z", "value": 94 }
      ]
    }
  }
}
\`\`\`

### POST /api/machines

Cria uma nova máquina.

**Request Body:**
\`\`\`json
{
  "name": "Compressor Industrial CI-500",
  "model": "CI-500",
  "type": "compressor",
  "serialNumber": "CI500-2025-000123",
  "manufacturer": "Industrial Compressors Ltd",
  "installationDate": "2025-01-15",
  "locationId": "loc-2",
  "specifications": {
    "power": "75 kW",
    "voltage": "380V",
    "frequency": "60 Hz",
    "weight": "1200 kg"
  },
  "maintenanceSchedule": {
    "intervalDays": 90,
    "lastMaintenance": "2025-01-15"
  }
}
\`\`\`

**Response 201:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "machine-new-123",
    "message": "Máquina criada com sucesso"
  }
}
\`\`\`

### PUT /api/machines/:id

Atualiza dados de uma máquina.

### DELETE /api/machines/:id

Remove uma máquina do sistema.

---

## 2. Localizações/Workspaces

### GET /api/locations

Retorna todas as localizações/workspaces configurados.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "oficina",
        "name": "Oficina Centro Automotiva",
        "type": "workshop",
        "address": "Rua das Oficinas, 123 - São Paulo, SP",
        "corridors": 3,
        "zones": ["Zone A1", "Zone A2", "Zone A3"],
        "machinesCount": 3,
        "activeMachines": 2,
        "coordinates": {
          "lat": -23.5505,
          "lng": -46.6333
        },
        "workingHours": {
          "start": "08:00",
          "end": "18:00"
        },
        "contact": {
          "name": "João Silva",
          "phone": "+55 11 99999-0000",
          "email": "joao@oficina.com"
        }
      },
      {
        "id": "fabrica",
        "name": "Fábrica Industrial",
        "type": "factory",
        "address": "Av. Industrial, 500 - Guarulhos, SP",
        "corridors": 4,
        "zones": ["Zone T1", "Zone T2", "Zone T3", "Zone T4"],
        "machinesCount": 4,
        "activeMachines": 4,
        "coordinates": {
          "lat": -23.4543,
          "lng": -46.5337
        }
      },
      {
        "id": "galpao",
        "name": "Galpão Logístico",
        "type": "warehouse",
        "address": "Rod. Dutra, km 225 - Jacareí, SP",
        "corridors": 5,
        "zones": ["Ala Norte", "Ala Sul", "Ala Leste", "Ala Oeste", "Centro"],
        "machinesCount": 5,
        "activeMachines": 4,
        "coordinates": {
          "lat": -23.2927,
          "lng": -45.9658
        }
      }
    ]
  }
}
\`\`\`

### GET /api/locations/:id

Retorna detalhes de uma localização específica com suas máquinas.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "oficina",
    "name": "Oficina Centro Automotiva",
    "type": "workshop",
    "address": "Rua das Oficinas, 123 - São Paulo, SP",
    "corridors": 3,
    "zones": ["Zone A1", "Zone A2", "Zone A3"],
    "layout": {
      "width": 50,
      "height": 30,
      "gridSize": 5
    },
    "machines": [
      {
        "id": "m1",
        "name": "Braço Robótico BR-001",
        "type": "robotic_arm",
        "corridor": 1,
        "position": { "x": 1, "y": 1 },
        "status": "operating",
        "efficiency": 86.8,
        "performance": 94.3,
        "quality": 98.3,
        "availability": 92.0,
        "lastUpdate": "2025-11-20T14:30:00Z"
      },
      {
        "id": "m2",
        "name": "Torno CNC T-3000",
        "type": "cnc",
        "corridor": 2,
        "position": { "x": 1, "y": 2 },
        "status": "maintenance",
        "efficiency": 0,
        "performance": 0,
        "quality": 0,
        "availability": 0,
        "maintenanceInfo": {
          "reason": "Manutenção preventiva programada",
          "estimatedCompletion": "2025-11-21T10:00:00Z",
          "technician": "Carlos Oliveira"
        }
      },
      {
        "id": "m3",
        "name": "Empilhadeira E-200",
        "type": "forklift",
        "corridor": 3,
        "position": { "x": 1, "y": 1 },
        "status": "operating",
        "efficiency": 92.5,
        "performance": 88.7,
        "quality": 100,
        "availability": 95.0
      }
    ],
    "metrics": {
      "overallEfficiency": 89.7,
      "averageAvailability": 93.5,
      "activeAlerts": 1,
      "tasksInProgress": 2
    },
    "schedule": {
      "timeline": [
        {
          "hour": "08:00",
          "machinesActive": 2,
          "events": []
        },
        {
          "hour": "09:00",
          "machinesActive": 3,
          "events": ["Início de turno"]
        }
      ]
    }
  }
}
\`\`\`

### POST /api/locations

Cria uma nova localização.

**Request Body:**
\`\`\`json
{
  "name": "Nova Fábrica",
  "type": "factory",
  "address": "Rua Nova, 100",
  "corridors": 4,
  "zones": ["Zona 1", "Zona 2", "Zona 3", "Zona 4"],
  "coordinates": {
    "lat": -23.5505,
    "lng": -46.6333
  },
  "workingHours": {
    "start": "07:00",
    "end": "19:00"
  },
  "contact": {
    "name": "Responsável",
    "phone": "+55 11 99999-0000",
    "email": "contato@fabrica.com"
  }
}
\`\`\`

### PUT /api/locations/:id

Atualiza uma localização.

### DELETE /api/locations/:id

Remove uma localização.

---

## 3. Funcionários

### GET /api/employees

Retorna lista de funcionários.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| department | string | Não | Filtrar por departamento |
| team | string | Não | Filtrar por equipe |
| status | string | Não | Filtrar por status: `online`, `idle`, `offline` |
| role | string | Não | Filtrar por cargo |
| location | string | Não | Filtrar por localização |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "1",
        "name": "Carlos Oliveira",
        "email": "carlos.oliveira@cognitiva.com",
        "phone": "+55 (11) 98765-4321",
        "role": "Técnico de Manutenção",
        "department": "Manutenção",
        "team": "Equipe Alpha",
        "location": "Oficina Centro Automotiva",
        "status": "online",
        "joinDate": "2024-01-15",
        "avatar": "CO",
        "avatarUrl": "/avatars/carlos-oliveira.jpg",
        "skills": ["Elétrica", "Mecânica", "Hidráulica"],
        "certifications": ["NR-10", "NR-12", "NR-35"],
        "tasksCompleted": 145,
        "currentTasks": 3,
        "performance": {
          "rating": 4.8,
          "tasksOnTime": 96,
          "qualityScore": 98
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 43
    }
  }
}
\`\`\`

### GET /api/employees/:id

Retorna detalhes de um funcionário.

### POST /api/employees

Cria um novo funcionário.

**Request Body:**
\`\`\`json
{
  "name": "Nome Completo",
  "email": "email@empresa.com",
  "phone": "+55 11 99999-0000",
  "role": "Técnico de Manutenção",
  "department": "Manutenção",
  "team": "Equipe Alpha",
  "location": "Oficina Centro Automotiva",
  "skills": ["Elétrica", "Mecânica"],
  "certifications": ["NR-10", "NR-12"]
}
\`\`\`

### PUT /api/employees/:id

Atualiza dados de um funcionário.

### DELETE /api/employees/:id

Remove um funcionário.

### PATCH /api/employees/:id/status

Atualiza status do funcionário.

**Request Body:**
\`\`\`json
{
  "status": "online" | "idle" | "offline"
}
\`\`\`

---

## 4. Equipe

### GET /api/team/members

Retorna membros da equipe para atribuição de tarefas.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "members": [
      { "id": "1", "name": "João Silva", "avatar": "/avatars/joao.jpg", "available": true },
      { "id": "2", "name": "Maria Santos", "avatar": null, "available": true },
      { "id": "3", "name": "Carlos Oliveira", "avatar": "/avatars/carlos.jpg", "available": false }
    ]
  }
}
\`\`\`

### GET /api/team/metrics

Retorna métricas da equipe.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| period | string | Não | Período: `30days`, `3months`, `6months` (default: 30days) |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "period": "30days",
    "metrics": {
      "totalEmployees": 43,
      "employeeChange": 2.8,
      "employeeChangeText": "+8 desde o último mês",
      "jobApplicants": 130,
      "applicantChange": 13.9,
      "applicantChangeText": "+48 desde o último mês",
      "totalSalary": 98842.0,
      "salaryChange": 24,
      "salaryChangeText": "+R$ 4.214,00 desde o último mês",
      "attendanceRate": 56,
      "attendanceChange": -17,
      "attendanceChangeText": "-16.4% desde o último mês"
    },
    "distribution": [
      { "role": "Técnicos de Manutenção", "count": 8, "percentage": 18.6 },
      { "role": "Engenheiros", "count": 6, "percentage": 14.0 },
      { "role": "Operadores", "count": 10, "percentage": 23.3 },
      { "role": "Analistas", "count": 5, "percentage": 11.6 },
      { "role": "Supervisores", "count": 4, "percentage": 9.3 }
    ]
  }
}
\`\`\`

### GET /api/team/projects

Retorna lista de projetos para categorização de tarefas.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "projects": [
      { "id": "manutencao", "name": "Manutenção Preventiva", "tasksCount": 12, "status": "active" },
      { "id": "corretiva", "name": "Manutenção Corretiva", "tasksCount": 8, "status": "active" },
      { "id": "automacao", "name": "Automação Industrial", "tasksCount": 5, "status": "active" },
      { "id": "upgrade", "name": "Upgrade de Equipamentos", "tasksCount": 3, "status": "active" },
      { "id": "calibracao", "name": "Calibração de Sensores", "tasksCount": 7, "status": "active" }
    ]
  }
}
\`\`\`

---

## 5. Tarefas (Kanban)

### GET /api/tasks

Retorna todas as tarefas organizadas por status (colunas do Kanban).

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| assignee | string | Não | Filtrar por ID do responsável |
| priority | string | Não | Filtrar por prioridade: `low`, `medium`, `high`, `urgent` |
| machine | string | Não | Filtrar por ID da máquina |
| location | string | Não | Filtrar por localização |
| project | string | Não | Filtrar por projeto |
| dueDate | string | Não | Filtrar por data de vencimento |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "columns": {
      "todo": {
        "id": "todo",
        "title": "A Fazer",
        "tasks": [
          {
            "id": "1",
            "title": "Inspeção de bomba centrífuga",
            "description": "Verificar condição do impelidor e selo mecânico",
            "tags": ["manutenção", "urgente"],
            "priority": "high",
            "progress": 0,
            "comments": 3,
            "attachments": 2,
            "assignees": [
              { "id": "1", "name": "João Silva", "avatar": null },
              { "id": "2", "name": "Maria Santos", "avatar": null }
            ],
            "dueDate": "2025-11-20",
            "createdAt": "2025-11-15",
            "status": "A Fazer",
            "machine": {
              "id": "machine-1",
              "name": "Bomba Centrífuga BC-101"
            },
            "location": "Setor de Produção A",
            "project": {
              "id": "manutencao",
              "name": "Manutenção Preventiva"
            },
            "estimatedHours": 4,
            "checklist": [
              { "id": "c1", "text": "Verificar vazamentos", "completed": false },
              { "id": "c2", "text": "Medir vibração", "completed": false },
              { "id": "c3", "text": "Checar temperatura", "completed": false }
            ]
          }
        ]
      },
      "inProgress": {
        "id": "inProgress",
        "title": "Em Progresso",
        "tasks": [
          {
            "id": "3",
            "title": "Troca de óleo do compressor",
            "description": "Substituir óleo e filtros do compressor industrial",
            "tags": ["manutenção", "rotina"],
            "priority": "medium",
            "progress": 65,
            "comments": 5,
            "attachments": 3,
            "assignees": [
              { "id": "4", "name": "Ana Costa", "avatar": null },
              { "id": "5", "name": "Pedro Alves", "avatar": null }
            ],
            "dueDate": "2025-11-19",
            "createdAt": "2025-11-12",
            "status": "Em Progresso",
            "machine": {
              "id": "machine-5",
              "name": "Compressor Industrial CI-450"
            },
            "location": "Oficina Central",
            "startedAt": "2025-11-16T08:30:00Z",
            "timeSpent": 12
          }
        ]
      },
      "review": {
        "id": "review",
        "title": "Em Revisão",
        "tasks": []
      },
      "done": {
        "id": "done",
        "title": "Concluído",
        "tasks": []
      }
    },
    "summary": {
      "total": 15,
      "todo": 5,
      "inProgress": 4,
      "review": 2,
      "done": 4,
      "overdue": 1
    }
  }
}
\`\`\`

### GET /api/tasks/:id

Retorna detalhes completos de uma tarefa.

### POST /api/tasks

Cria uma nova tarefa.

**Request Body:**
\`\`\`json
{
  "title": "Nova tarefa de manutenção",
  "description": "Descrição detalhada da tarefa",
  "priority": "high",
  "assignees": ["1", "2"],
  "machineId": "machine-1",
  "location": "Setor A",
  "projectId": "manutencao",
  "dueDate": "2025-11-25",
  "estimatedHours": 6,
  "tags": ["manutenção", "preventiva"],
  "checklist": [
    { "text": "Item 1", "completed": false },
    { "text": "Item 2", "completed": false }
  ]
}
\`\`\`

### PUT /api/tasks/:id

Atualiza uma tarefa.

### DELETE /api/tasks/:id

Remove uma tarefa.

### PATCH /api/tasks/:id/status

Move uma tarefa para outra coluna.

**Request Body:**
\`\`\`json
{
  "status": "inProgress",
  "position": 0
}
\`\`\`

### PATCH /api/tasks/:id/progress

Atualiza progresso da tarefa.

**Request Body:**
\`\`\`json
{
  "progress": 75
}
\`\`\`

### POST /api/tasks/:id/comments

Adiciona comentário à tarefa.

**Request Body:**
\`\`\`json
{
  "content": "Texto do comentário",
  "authorId": "1"
}
\`\`\`

### POST /api/tasks/:id/attachments

Adiciona anexo à tarefa (multipart/form-data).

---

## 6. Relatórios

### GET /api/reports/machines

Retorna relatórios de análise de máquinas.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| machineId | string | Não | Filtrar por ID da máquina |
| dateFrom | string | Não | Data inicial (YYYY-MM-DD) |
| dateTo | string | Não | Data final (YYYY-MM-DD) |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "R-2025-001",
        "machineId": "machine-1",
        "machineName": "Bomba Centrífuga BC-2000",
        "date": "2025-01-15",
        "time": "14:30",
        "health": 98,
        "healthStatus": "Excelente",
        "temperature": 72,
        "temperatureStatus": "Normal",
        "vibration": 2.1,
        "vibrationStatus": "Normal",
        "consumption": 45.2,
        "consumptionStatus": "Eficiente",
        "aiAnalysis": [
          "Todos os sistemas operacionais",
          "Componentes críticos verificados",
          "Operando em condições ideais"
        ],
        "recommendations": [
          "Próxima manutenção: 90 dias",
          "Verificar rolamentos",
          "Manter lubrificação"
        ],
        "generatedBy": "IA Bedrock",
        "approvedBy": null
      }
    ]
  }
}
\`\`\`

### GET /api/reports/metrics

Retorna relatórios de métricas gerais.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "MR-2025-001",
        "title": "Relatório de Tarefas e Máquinas",
        "type": "tasks",
        "date": "2025-01-20",
        "time": "10:30",
        "period": "30 Dias",
        "summary": "24 máquinas monitoradas, 87% taxa de operação, 145 tarefas concluídas",
        "metrics": {
          "machinesMonitored": 24,
          "operationRate": 87,
          "tasksCompleted": 145,
          "avgCompletionTime": "4.2 horas",
          "maintenanceCost": 12500.00
        },
        "charts": {
          "tasksPerDay": [
            { "date": "2025-01-14", "completed": 5, "created": 3 },
            { "date": "2025-01-15", "completed": 7, "created": 4 }
          ],
          "machineStatus": {
            "operational": 20,
            "maintenance": 3,
            "offline": 1
          }
        }
      }
    ]
  }
}
\`\`\`

### GET /api/reports/:id

Retorna relatório completo por ID.

### POST /api/reports

Gera novo relatório.

**Request Body:**
\`\`\`json
{
  "type": "machines" | "tasks" | "team" | "inventory",
  "machineId": "machine-1",
  "period": "30days",
  "includeAiAnalysis": true
}
\`\`\`

### GET /api/reports/:id/export

Exporta relatório em PDF.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| format | string | Formato: `pdf`, `xlsx`, `csv` |

**Response:** File download

---

## 7. Inventário

### GET /api/inventory

Retorna lista de peças e componentes do inventário.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| category | string | Não | Categoria da peça |
| status | string | Não | Status: `in_stock`, `low_stock`, `out_of_stock` |
| search | string | Não | Busca por nome ou código |
| compatibleWith | string | Não | ID da máquina compatível |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "part-1",
        "partNumber": "ROL-6205-2RS",
        "name": "Rolamento 6205-2RS",
        "description": "Rolamento rígido de esferas, vedação dupla",
        "category": "Rolamentos",
        "manufacturer": "SKF",
        "quantity": {
          "available": 15,
          "reserved": 3,
          "minimum": 5
        },
        "status": "in_stock",
        "location": {
          "warehouse": "Almoxarifado Central",
          "shelf": "A-12",
          "bin": "B-03"
        },
        "price": {
          "cost": 45.00,
          "currency": "BRL"
        },
        "compatibleMachines": [
          { "id": "machine-1", "name": "Bomba Centrífuga BC-2000" },
          { "id": "machine-3", "name": "Motor Elétrico ME-500" }
        ],
        "image": "/images/parts/rolamento-6205.jpg",
        "lastRestocked": "2025-11-10",
        "supplier": {
          "id": "sup-1",
          "name": "SKF Brasil",
          "leadTime": "3-5 dias"
        }
      }
    ],
    "summary": {
      "totalItems": 156,
      "inStock": 120,
      "lowStock": 25,
      "outOfStock": 11,
      "totalValue": 45678.90
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156
    }
  }
}
\`\`\`

### GET /api/inventory/:id

Retorna detalhes de uma peça.

### POST /api/inventory

Cadastra nova peça.

### PUT /api/inventory/:id

Atualiza dados de uma peça.

### POST /api/inventory/:id/movement

Registra movimentação de estoque.

**Request Body:**
\`\`\`json
{
  "type": "purchase" | "usage" | "return" | "adjustment",
  "quantity": 10,
  "reason": "Reposição de estoque",
  "relatedTaskId": "task-1",
  "relatedMachineId": "machine-1",
  "cost": 450.00
}
\`\`\`

---

## 8. Fornecedores (Peças)

### GET /api/vendors

Retorna fornecedores de peças próximos.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| partName | string | Sim | Nome da peça buscada |
| lat | number | Sim | Latitude da localização atual |
| lng | number | Sim | Longitude da localização atual |
| radius | number | Não | Raio de busca em km (default: 50) |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "partName": "Rolamento 6205-2RS",
    "searchLocation": {
      "lat": -23.5505,
      "lng": -46.6333
    },
    "vendors": [
      {
        "id": "vendor-1",
        "name": "AutoPeças Premium",
        "rating": 4.8,
        "reviewsCount": 156,
        "distance": 2.3,
        "estimatedTime": 8,
        "status": "open",
        "address": "Rua das Peças, 123 - São Paulo",
        "coordinates": {
          "lat": -23.5605,
          "lng": -46.6433
        },
        "phone": "+55 11 3456-7890",
        "workingHours": "08:00 - 18:00",
        "price": {
          "current": 2250.00,
          "original": 2800.00,
          "discount": 20,
          "currency": "BRL"
        },
        "availability": "in_stock",
        "deliveryOptions": [
          { "type": "pickup", "time": "Imediato" },
          { "type": "delivery", "time": "2-4 horas", "cost": 25.00 }
        ],
        "image": "/images/vendors/autopecas.jpg",
        "isTop": true,
        "aiRecommended": true,
        "aiRecommendationReason": "Melhor custo-benefício considerando preço, distância e avaliações"
      },
      {
        "id": "vendor-2",
        "name": "Oficina Central Peças",
        "rating": 4.9,
        "reviewsCount": 203,
        "distance": 4.1,
        "estimatedTime": 15,
        "status": "open",
        "address": "Av. Industrial, 500 - São Paulo",
        "coordinates": {
          "lat": -23.5805,
          "lng": -46.6633
        },
        "price": {
          "current": 2180.00,
          "original": 2600.00,
          "discount": 16,
          "currency": "BRL"
        },
        "availability": "in_stock",
        "isTop": false
      }
    ],
    "route": {
      "selectedVendor": "vendor-1",
      "distance": 2.3,
      "duration": 8,
      "waypoints": [
        { "lat": -23.5505, "lng": -46.6333 },
        { "lat": -23.5555, "lng": -46.6383 },
        { "lat": -23.5605, "lng": -46.6433 }
      ]
    }
  }
}
\`\`\`

### GET /api/vendors/:id

Retorna detalhes de um fornecedor.

### GET /api/vendors/:id/route

Retorna rota até o fornecedor.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| fromLat | number | Latitude de origem |
| fromLng | number | Longitude de origem |

---

## 9. AWS Bedrock - Renderização 3D

### GET /api/bedrock/render-config

Retorna configuração de renderização 3D gerada pela IA Bedrock.

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| locationType | string | Sim | Tipo: `workshop`, `factory`, `warehouse` |
| locationId | string | Não | ID da localização específica |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "renderConfig": {
      "version": "1.0",
      "generatedAt": "2025-11-20T14:30:00Z",
      "generatedBy": "bedrock-claude-3",
      "scene": {
        "type": "workshop",
        "dimensions": {
          "width": 50,
          "height": 10,
          "depth": 30
        },
        "floor": {
          "material": "concrete",
          "color": "#4a4a4a",
          "reflectivity": 0.3
        },
        "walls": {
          "material": "metal_panels",
          "color": "#e8e8e8",
          "height": 8
        },
        "ceiling": {
          "type": "industrial",
          "hasSkylights": true,
          "lightingRails": true
        }
      },
      "lighting": {
        "ambient": {
          "color": "#ffffff",
          "intensity": 0.4
        },
        "directional": [
          {
            "position": { "x": 10, "y": 15, "z": 10 },
            "target": { "x": 0, "y": 0, "z": 0 },
            "color": "#ffffff",
            "intensity": 0.8,
            "castShadow": true
          }
        ],
        "spotlights": [
          {
            "position": { "x": -5, "y": 8, "z": 0 },
            "target": { "x": -5, "y": 0, "z": 0 },
            "color": "#fff5e6",
            "intensity": 0.6,
            "angle": 45,
            "penumbra": 0.3
          }
        ]
      },
      "machines": [
        {
          "id": "m1",
          "type": "robotic_arm",
          "model": "robotic-arm-v2.glb",
          "position": { "x": -8, "y": 0, "z": -5 },
          "rotation": { "x": 0, "y": 45, "z": 0 },
          "scale": { "x": 1, "y": 1, "z": 1 },
          "status": "operating",
          "animations": {
            "idle": "arm_idle",
            "operating": "arm_working",
            "maintenance": "arm_stopped"
          },
          "interactionPoints": [
            {
              "id": "control_panel",
              "position": { "x": 0.5, "y": 1.2, "z": 0 },
              "type": "panel",
              "label": "Painel de Controle"
            }
          ],
          "statusIndicator": {
            "position": { "x": 0, "y": 2.5, "z": 0 },
            "colors": {
              "operating": "#22c55e",
              "warning": "#f59e0b",
              "critical": "#ef4444",
              "maintenance": "#3b82f6"
            }
          },
          "realTimeData": {
            "refreshRate": 1000,
            "metrics": ["temperature", "vibration", "efficiency"]
          }
        },
        {
          "id": "m2",
          "type": "cnc",
          "model": "cnc-machine-v1.glb",
          "position": { "x": 5, "y": 0, "z": -8 },
          "rotation": { "x": 0, "y": -30, "z": 0 },
          "scale": { "x": 1.2, "y": 1.2, "z": 1.2 },
          "status": "maintenance",
          "animations": {
            "idle": "cnc_idle",
            "operating": "cnc_cutting",
            "maintenance": "cnc_open"
          }
        },
        {
          "id": "m3",
          "type": "forklift",
          "model": "forklift-v1.glb",
          "position": { "x": 0, "y": 0, "z": 5 },
          "rotation": { "x": 0, "y": 0, "z": 0 },
          "scale": { "x": 0.8, "y": 0.8, "z": 0.8 },
          "status": "operating",
          "animations": {
            "idle": "forklift_parked",
            "operating": "forklift_moving",
            "lifting": "forklift_lift"
          },
          "pathAnimation": {
            "enabled": true,
            "waypoints": [
              { "x": 0, "y": 0, "z": 5 },
              { "x": 10, "y": 0, "z": 5 },
              { "x": 10, "y": 0, "z": -5 },
              { "x": 0, "y": 0, "z": -5 }
            ],
            "speed": 2,
            "loop": true
          }
        }
      ],
      "environment": {
        "shelves": [
          {
            "position": { "x": -15, "y": 0, "z": 0 },
            "dimensions": { "width": 2, "height": 4, "depth": 10 },
            "levels": 4,
            "itemsDensity": 0.7
          }
        ],
        "workbenches": [
          {
            "position": { "x": 8, "y": 0, "z": 8 },
            "rotation": { "y": 90 },
            "hasTools": true
          }
        ],
        "safetyElements": {
          "emergencyExits": [
            { "position": { "x": -20, "y": 0, "z": 0 }, "direction": "west" }
          ],
          "fireExtinguishers": [
            { "position": { "x": -18, "y": 1.2, "z": 10 } }
          ],
          "safetyLines": {
            "color": "#fbbf24",
            "width": 0.1,
            "paths": [
              [{ "x": -12, "z": -12 }, { "x": -12, "z": 12 }, { "x": 12, "z": 12 }, { "x": 12, "z": -12 }]
            ]
          }
        },
        "decorations": [
          {
            "type": "barrel",
            "position": { "x": -18, "y": 0, "z": -8 },
            "color": "blue"
          },
          {
            "type": "pallet",
            "position": { "x": 15, "y": 0, "z": 10 },
            "stacked": 2
          }
        ]
      },
      "camera": {
        "defaultPosition": { "x": 25, "y": 20, "z": 25 },
        "defaultTarget": { "x": 0, "y": 0, "z": 0 },
        "fov": 60,
        "near": 0.1,
        "far": 1000,
        "minDistance": 5,
        "maxDistance": 100,
        "presets": [
          {
            "name": "Visão Geral",
            "position": { "x": 25, "y": 20, "z": 25 },
            "target": { "x": 0, "y": 0, "z": 0 }
          },
          {
            "name": "Linha de Produção",
            "position": { "x": 0, "y": 8, "z": 20 },
            "target": { "x": 0, "y": 0, "z": 0 }
          },
          {
            "name": "Área de Estoque",
            "position": { "x": -20, "y": 10, "z": 0 },
            "target": { "x": -15, "y": 2, "z": 0 }
          }
        ]
      },
      "interactions": {
        "machineClick": {
          "highlightColor": "#3b82f6",
          "highlightIntensity": 0.5,
          "showInfoPanel": true
        },
        "hover": {
          "cursorChange": true,
          "tooltipDelay": 500
        },
        "selection": {
          "outlineColor": "#8b5cf6",
          "outlineWidth": 2
        }
      },
      "performance": {
        "shadows": "medium",
        "antialiasing": true,
        "maxLights": 8,
        "lodLevels": 3,
        "textureQuality": "high"
      }
    }
  }
}
\`\`\`

### POST /api/bedrock/analyze-scene

Solicita análise de IA para otimização do layout 3D.

**Request Body:**
\`\`\`json
{
  "locationId": "oficina",
  "currentLayout": {
    "machines": [
      { "id": "m1", "position": { "x": 0, "y": 0, "z": 0 } }
    ]
  },
  "optimizationGoals": ["efficiency", "safety", "space"]
}
\`\`\`

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "analysis": {
      "currentScore": 72,
      "potentialScore": 89,
      "suggestions": [
        {
          "machineId": "m1",
          "currentPosition": { "x": 0, "y": 0, "z": 0 },
          "suggestedPosition": { "x": -5, "y": 0, "z": -3 },
          "reason": "Melhor fluxo de trabalho e acesso para manutenção",
          "impactScore": 15
        }
      ],
      "safetyIssues": [
        {
          "type": "clearance",
          "description": "Espaço insuficiente entre máquinas m2 e m3",
          "severity": "medium",
          "recommendation": "Aumentar distância para 2 metros"
        }
      ],
      "efficiencyGains": {
        "productionFlow": "+12%",
        "maintenanceAccess": "+18%",
        "safetyCompliance": "+25%"
      }
    }
  }
}
\`\`\`

### POST /api/bedrock/generate-model

Solicita geração de modelo 3D para uma máquina.

**Request Body:**
\`\`\`json
{
  "machineType": "centrifugal-pump",
  "specifications": {
    "manufacturer": "Industrial Pumps Co.",
    "model": "BC-2000",
    "dimensions": {
      "length": 1.2,
      "width": 0.8,
      "height": 1.0
    }
  },
  "detailLevel": "high",
  "includeAnimations": true
}
\`\`\`

---

## 10. Dashboard

### GET /api/dashboard/summary

Retorna resumo geral do dashboard.

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "summary": {
      "totalMachines": 45,
      "activeMachines": 38,
      "machinesWithIssues": 5,
      "pendingTasks": 12,
      "completedTasksToday": 8,
      "maintenanceScheduled": 3,
      "efficiencyRate": 87.5,
      "downtimeHours": 4.2
    },
    "alerts": {
      "critical": 2,
      "warning": 5,
      "info": 8
    },
    "recentActivity": [
      {
        "id": "act-1",
        "type": "task_completed",
        "description": "Manutenção preventiva concluída",
        "machine": "Bomba BC-2000",
        "user": "Carlos Oliveira",
        "timestamp": "2025-11-20T14:30:00Z"
      }
    ],
    "upcomingMaintenance": [
      {
        "machineId": "machine-3",
        "machineName": "Motor ME-500",
        "scheduledDate": "2025-11-22",
        "type": "preventive"
      }
    ]
  }
}
\`\`\`

### GET /api/dashboard/charts

Retorna dados para gráficos do dashboard.

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| period | string | Período: `7days`, `30days`, `90days` |

**Response 200:**
\`\`\`json
{
  "success": true,
  "data": {
    "machineStatus": {
      "operational": 38,
      "maintenance": 4,
      "offline": 2,
      "critical": 1
    },
    "efficiencyTrend": [
      { "date": "2025-11-14", "value": 85.2 },
      { "date": "2025-11-15", "value": 86.1 },
      { "date": "2025-11-16", "value": 87.5 },
      { "date": "2025-11-17", "value": 86.8 },
      { "date": "2025-11-18", "value": 88.2 },
      { "date": "2025-11-19", "value": 87.9 },
      { "date": "2025-11-20", "value": 87.5 }
    ],
    "tasksCompletion": [
      { "date": "2025-11-14", "completed": 5, "created": 3 },
      { "date": "2025-11-15", "completed": 7, "created": 4 },
      { "date": "2025-11-16", "completed": 6, "created": 5 },
      { "date": "2025-11-17", "completed": 8, "created": 6 },
      { "date": "2025-11-18", "completed": 4, "created": 3 },
      { "date": "2025-11-19", "completed": 9, "created": 7 },
      { "date": "2025-11-20", "completed": 8, "created": 5 }
    ],
    "maintenanceCost": {
      "monthly": [
        { "month": "Jun", "cost": 12500 },
        { "month": "Jul", "cost": 15800 },
        { "month": "Ago", "cost": 11200 },
        { "month": "Set", "cost": 18500 },
        { "month": "Out", "cost": 14300 },
        { "month": "Nov", "cost": 13200 }
      ],
      "byCategory": [
        { "category": "Peças", "value": 45 },
        { "category": "Mão de obra", "value": 35 },
        { "category": "Serviços externos", "value": 15 },
        { "category": "Outros", "value": 5 }
      ]
    }
  }
}
\`\`\`

---

## 11. Monitoramento em Tempo Real

### WebSocket /ws/monitoring

Conexão WebSocket para receber atualizações em tempo real.

**Eventos Recebidos (Server → Client):**

#### machine_update
\`\`\`json
{
  "event": "machine_update",
  "data": {
    "machineId": "machine-1",
    "metrics": {
      "temperature": 66,
      "vibration": 2.2,
      "pressure": 8.6,
      "efficiency": 93
    },
    "status": "operational",
    "timestamp": "2025-11-20T14:30:05Z"
  }
}
\`\`\`

#### alert
\`\`\`json
{
  "event": "alert",
  "data": {
    "id": "alert-123",
    "machineId": "machine-3",
    "machineName": "Motor ME-500",
    "type": "warning",
    "message": "Temperatura acima do normal: 82°C",
    "value": 82,
    "threshold": 75,
    "timestamp": "2025-11-20T14:30:10Z"
  }
}
\`\`\`

#### task_update
\`\`\`json
{
  "event": "task_update",
  "data": {
    "taskId": "task-5",
    "status": "completed",
    "completedBy": "Carlos Oliveira",
    "timestamp": "2025-11-20T14:30:15Z"
  }
}
\`\`\`

**Eventos Enviados (Client → Server):**

#### subscribe
\`\`\`json
{
  "action": "subscribe",
  "channels": ["machines", "alerts", "tasks"],
  "filters": {
    "locationId": "oficina",
    "machineIds": ["machine-1", "machine-2"]
  }
}
\`\`\`

#### unsubscribe
\`\`\`json
{
  "action": "unsubscribe",
  "channels": ["alerts"]
}
\`\`\`

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Parâmetros inválidos |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão para o recurso |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 422 | Unprocessable Entity - Dados inválidos |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro interno |

**Formato de Erro:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
\`\`\`

---

## Headers Padrão

**Request Headers:**
\`\`\`
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>
X-Client-Version: 1.0.0
\`\`\`

**Response Headers:**
\`\`\`
Content-Type: application/json
X-Request-ID: <uuid>
X-Response-Time: 45ms
X-Rate-Limit-Remaining: 99
X-Rate-Limit-Reset: 1700000000
\`\`\`

---

## Rate Limiting

- **Limite padrão:** 100 requests/minuto por usuário
- **Limite para WebSocket:** 10 conexões simultâneas por usuário
- **Limite para upload:** 10 MB por arquivo, 50 MB total por request

---

## Versionamento

A API utiliza versionamento via URL: `/api/v1/...`

Versões anteriores serão mantidas por 6 meses após deprecation.

---

## Ambiente de Desenvolvimento

**Base URL Mock:** `/api/mock/...`

Os endpoints mock retornam dados simulados para desenvolvimento e testes do frontend.
