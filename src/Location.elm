module Location exposing (X, Y, xDecoder, yDecoder)

import Json.Decode as JD exposing (Decoder)


type alias X =
    Int


type alias Y =
    Int


xDecoder : Decoder X
xDecoder =
    JD.field "X" JD.int


yDecoder : Decoder Y
yDecoder =
    JD.field "Y" JD.int
