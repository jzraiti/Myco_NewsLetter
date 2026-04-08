from dataclasses import dataclass, field
from typing import Any, Literal


@dataclass
class WorkflowStepResult:
    step: str
    status: Literal["success", "partial", "failed", "skipped"]
    payload: Any | None = None
    error: str | None = None
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class DeliveryRecipientResult:
    email: str
    status: Literal["sent", "failed"]
    provider_id: str | None = None
    error: str | None = None


@dataclass
class DeliveryResult:
    status: Literal["success", "partial", "failed"]
    sent: list[DeliveryRecipientResult]
    failed: list[DeliveryRecipientResult]


@dataclass
class UploadResult:
    status: Literal["success", "failed"]
    bucket: str
    key: str
    url: str | None = None
    error: str | None = None
