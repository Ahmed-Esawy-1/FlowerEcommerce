package com.ahmedesawy.petalia.auth;

import java.util.UUID;

public record AccountIdentity(UUID id, String email, AccountType type) {
    public enum AccountType { CUSTOMER, EMPLOYEE }
}