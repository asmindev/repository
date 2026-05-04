<?php

namespace App\Enums;

enum WorkStatus: string
{
    case DRAFT = 'draft';
    case PENDING_REVIEW = 'pending_review';
    case IN_REVIEW = 'in_review';
    case REVISION = 'revision';
    case APPROVED = 'approved';
    case PUBLISHED = 'published';
    case REJECTED = 'rejected';
}
