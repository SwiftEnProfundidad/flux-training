## ADDED Requirements

### Requirement: Pumuki integration issues log must exist
The repository SHALL maintain a canonical log for Pumuki integration bugs and improvements.

#### Scenario: Canonical log file is present
- **WHEN** repository documentation is reviewed
- **THEN** file `docs/BUGS_Y_MEJORAS_PUMUKI.md` exists and is readable

### Requirement: Each issue entry must include actionable evidence
Every new Pumuki issue entry SHALL include symptom, impact, evidence, proposal, and status.

#### Scenario: New issue is recorded
- **WHEN** a developer adds a new bug/improvement item
- **THEN** the item includes `Sintoma`, `Impacto`, `Evidencia`, `Propuesta`, and `Estado`

### Requirement: Iteration workflow must enforce issue logging
The agent workflow SHALL require updating the Pumuki issue log on every iteration where a Pumuki issue is detected.

#### Scenario: Iteration detects Pumuki gate or hook issue
- **WHEN** a Pumuki-related blocker appears during an iteration
- **THEN** the issue is appended to the canonical Pumuki log before task closure
