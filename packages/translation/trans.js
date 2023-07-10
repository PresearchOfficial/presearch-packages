syntax = "proto3";

message Input {
    string source_lang = 1;
    string target_lang = 2;
    string sentences_url = 3;
}

message Output {
    string translation = 1;
}

service RomanceTranslator {
    rpc translate(Input) returns (Output) {}
}
