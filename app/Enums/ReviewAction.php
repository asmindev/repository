<?php

namespace App\Enums;

enum ReviewAction: string
{
    case ASSIGNED = 'assigned';
    case IN_REVIEW = 'in_review';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case REVISION = 'revision';
}
