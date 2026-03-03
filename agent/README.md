# JOSEPH AI - ReACT Agent with RAG Brain

An agentic AI system that serves as the intelligent decision-making layer for the entire software system. JOSEPH AI combines reasoning (ReACT), grounded knowledge (RAG), autonomous intelligence, and full system control.

## What is JOSEPH AI?

**ReACT Agent**: Implements the Think → Act → Observe → Reason loop for intelligent decision-making.

**RAG Brain**: Uses Retrieval-Augmented Generation to ground reasoning in real data, reducing hallucinations.

**Autonomous + Reactive**: Operates in two modes simultaneously:
- **Autonomous**: Scheduled tasks 8× daily (12am, 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm)
- **Reactive**: Responds to user commands and system events

## Folder Structure

```
agent/
├── core/                    # Core agent orchestration & reasoning
│   ├── agent.py            # Main agent loop / orchestrator
│   ├── memory.py           # RAG retrieval logic & knowledge grounding
│   ├── planner.py          # ReACT reasoning & action selection
│   └── __init__.py
│
├── retrieval/              # RAG retrieval system (the brain's memory)
│   ├── retriever.py        # Context retrieval from sources
│   ├── sources.py          # Knowledge sources (DB, docs, scraped data)
│   ├── ranker.py           # Relevance scoring & filtering
│   └── __init__.py
│
├── document_processing/    # Document ingestion & processing pipeline
│   ├── ingest.py           # File intake (PDF, DOCX, CSV, images)
│   ├── extract.py          # Text/data extraction
│   ├── normalize.py        # Clean + structure content
│   ├── metadata.py         # Tags, dates, owners, categories
│   └── __init__.py
│
├── llm/                    # Language model integration
│   ├── client.py           # OpenAI / LLM client wrapper
│   ├── cost_guard.py       # Token & credit enforcement
│   └── __init__.py
│
├── tools/                  # Action tools for system integration
│   ├── api_tools.py        # Internal system API calls
│   ├── scraper.py          # Economic news web scraping
│   ├── documents.py        # User document processing & extraction
│   └── __init__.py
│
├── schedules/              # Autonomous task scheduling
│   ├── cron.py             # 8× daily task scheduling
│   └── __init__.py
│
├── prompts/                # LLM prompts and guidelines
│   ├── system.txt          # Core system prompt for reasoning
│   ├── tools.txt           # Tool usage rules & constraints
│   └── __init__.py
│
├── shared/                 # Shared types & schemas
│   ├── schemas.py          # Common data structures
│   └── __init__.py
│
├── config.py               # Central configuration
├── __init__.py
└── README.md              # This file
```

## Module Overview

### Core Intelligence
**`core/agent.py` - Agent Orchestrator**
Main entry point for the agent. Coordinates:
- Input processing (user queries, scheduled triggers, document uploads)
- ReACT loop execution
- Tool/action selection and execution
- Response generation

**`core/memory.py` - RAG Brain**
Knowledge management and context grounding. Provides:
- Document indexing and retrieval
- Economic data storage
- User-uploaded document processing
- Context for informed reasoning
- Hallucination prevention

**`core/planner.py` - ReACT Planner**
Intelligent reasoning and action selection. Implements:
- Intent analysis
- Tool selection logic
- Action sequencing
- Outcome verification
- Decision-making

### Retrieval System (RAG Backend)
**`retrieval/retriever.py` - Context Retrieval**
Retrieves relevant context to ground reasoning:
- Semantic search over documents
- Historical data lookup
- Economic intelligence retrieval
- User preferences and history
- Business rules and constraints

**`retrieval/sources.py` - Knowledge Sources**
Manages all data sources feeding the RAG brain:
- Database connections for business data
- Document storage (processed uploads)
- Scraped economic data repositories
- Historical insights
- User context and preferences

**`retrieval/ranker.py` - Relevance Ranking**
Ensures high-quality context for reasoning:
- Semantic similarity scoring
- Recency weighting
- Source credibility scoring
- Duplicate filtering
- Context window optimization

### Document Processing Pipeline
**`document_processing/ingest.py` - File Intake**
First stage of processing:
- PDF, DOCX, XLSX, CSV, images support (OCR)
- Virus/malware scanning
- Format detection
- Temporary storage management

**`document_processing/extract.py` - Text/Data Extraction**
Second stage:
- PDF text extraction
- Table extraction from spreadsheets
- Form parsing
- Image OCR
- Language detection

**`document_processing/normalize.py` - Content Normalization**
Third stage:
- Text cleaning
- Data standardization
- Business rule validation
- Format standardization
- Type conversion

**`document_processing/metadata.py` - Metadata Management**
Tagging and categorization:
- Document type classification
- Owner and user association
- Content tags and keywords
- Processing pipeline metadata
- Data lineage tracking

### Language Model Integration
**`llm/client.py` - LLM Client Wrapper**
Abstraction for LLM interactions:
- Multi-provider support (OpenAI, Claude, etc.)
- Prompt templating
- Response parsing
- Streaming and batch processing
- Retry logic and error handling

**`llm/cost_guard.py` - Cost & Token Management**
Prevents runaway costs:
- Token counting and cost calculation
- Per-request budget enforcement
- Daily/weekly/monthly quota management
- Cost alerting and warnings
- Fallback to cheaper models

### Action Tools
**`tools/api_tools.py` - System API Integration**
Interface to all backend system APIs. Enables:
- Data creation/updates/validation
- Forecast generation
- Report execution
- Dashboard updates
- Alert triggering
- Workflow execution

**`tools/scraper.py` - Economic Intelligence Harvesting**
Autonomous web scraping for economic data. Handles:
- ~20 approved economic news sources
- Macro signal extraction
- Policy change detection
- Market risk identification
- Content cleaning and summarization

**`tools/documents.py` - Document Processing Trigger**
Automatic document analysis on user upload. Performs:
- File format handling
- Predefined information extraction
- Data validation and normalization
- API integration for storage
- Trigger follow-up actions

### Infrastructure
**`schedules/cron.py` - Autonomous Task Scheduler**
Background task execution without user input. Manages:
- 8 daily execution times (12am, 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm)
- Scraper invocation
- Data pipeline updates
- Knowledge base refresh

**`config.py` - Central Configuration**
Centralized settings for:
- API credentials and endpoints
- LLM model parameters
- RAG settings
- Schedule times
- Document extraction rules
- Economic data sources
- Rate limits and safety rails

## How JOSEPH AI Works

### ReACT Loop (Core Intelligence)

```
1. Think
   - Analyze user intent or scheduled trigger
   - Retrieve context from knowledge base (RAG)
   - Consider constraints and available tools

2. Act
   - Select appropriate action/tool
   - Execute against system APIs or external services
   - Handle errors and retries

3. Observe
   - Capture action results
   - Evaluate success/failure
   - Update context

4. Reason
   - Process observations
   - Determine if more actions needed
   - Prepare response or next step
```

### RAG Brain (Retrieval-Augmented Generation)

The brain is a three-layer system:

```
User Query or Document Upload
         ↓
┌─────────────────────────────┐
│  Document Processing        │
│  - Ingest uploaded files    │
│  - Extract text/data        │
│  - Normalize content        │
│  - Tag metadata             │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Knowledge Sources          │
│  - Database storage         │
│  - Vector embeddings        │
│  - Economic data repository │
│  - Historical insights      │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Retrieval & Ranking        │
│  - Semantic search          │
│  - Relevance scoring        │
│  - Source credibility       │
│  - Context filtering        │
└──────────────┬──────────────┘
               ↓
         Grounded Context
               ↓
      LLM Reasoning + ReACT
               ↓
          Agent Response
```

**Key Insight**: The agent never reasons in a vacuum. Every decision is grounded in retrieved context, reducing hallucinations and ensuring business-rule compliance.

### Operational Modes

#### Autonomous Mode (8× Daily)
Runs on schedule without user input:
- Scrapes economic data
- Updates knowledge base
- Triggers dependent workflows
- Stores insights for reasoning

#### Reactive Mode (User-triggered)
Responds to:
- User queries and commands
- Document uploads
- System events
- API triggers

## Key Capabilities

1. **Intelligent Reasoning**: Think through problems using grounded knowledge
2. **Full System Control**: Access every API endpoint as an action tool
3. **Document Intelligence**: Auto-process user uploads (no explicit instruction needed)
4. **Economic Awareness**: Autonomous intelligence gathering 8× daily
5. **Conversational Interface**: Natural language interaction with reasoning transparency
6. **Autonomous Operations**: Background intelligence gathering without user involvement

## Document Processing Pipeline

When a user uploads a document, it flows through this automated pipeline:

```
User Upload
    ↓
INGEST ────────────────────────── Validate file type, scan for malware
    ↓
EXTRACT ──────────────────────── Parse PDF/DOCX/CSV, OCR images
    ↓
NORMALIZE ────────────────────── Clean text, standardize data, validate
    ↓
METADATA ────────────────────── Tag type, owner, category, confidence
    ↓
STORAGE ──────────────────────── Store in knowledge base with embeddings
    ↓
TRIGGER ACTIONS ───────────── Push to APIs, update forecasts, send alerts
    ↓
User sees results in Frontend (zero additional action needed)
```

**No User Instruction Needed**: Document upload is the implicit trigger. The agent automatically:
- Detects document type
- Extracts predefined information
- Validates against business rules
- Stores and indexes for future retrieval
- Triggers any dependent workflows

## Integration Points

- **Frontend**: The React UI (in `../src/`) communicates with the agent via REST APIs
- **Backend APIs**: JOSEPH AI calls all system endpoints for data and actions
- **External Services**: Web scraping, LLM calls, database access
- **Database**: Stores processed documents, extracted insights, economic data
- **LLM Providers**: OpenAI, Claude, or other LLM services (with cost controls)

## Getting Started

Implementation will proceed module-by-module:

1. **Phase 1**: Core agent loop and ReACT planner
2. **Phase 2**: RAG memory system and knowledge management
3. **Phase 3**: Tool implementations (API, scraper, documents)
4. **Phase 4**: Autonomous scheduling
5. **Phase 5**: Frontend integration layer

Each module is ready to be filled in with actual implementation code.

## Notes

- The agent is **capability-driven**, not module-driven. It sees actions and capabilities, not screens.
- RAG is essential: reasoning always grounded in real data.
- Tools are the bridge between ReACT reasoning and system capabilities.
- Configuration is centralized for maintainability.
