package com.deliberation.model.enums;

public enum MentionType {

    DEFAILLANT("DEF"),
    PASSABLE("PAS"),
    ASSEZ_BIEN("AB"),
    BIEN("B"),
    TRES_BIEN("TB"),
    EXCELLENT("E");

    private final String code;

    MentionType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
