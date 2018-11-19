module Bot exposing (Bot, BotId, emptyBot, getBots)

import Http
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Pipeline exposing (required)
import Location exposing (X, Y)


type alias BotId =
    String


type alias Bot =
    { id : BotId
    , locationX : X
    , locationY : Y
    , score : Int
    , claims : List String
    }


emptyBot : Bot
emptyBot =
    Bot "" 999 999 0 []


getBots : Http.Request (List Bot)
getBots =
    Http.get "https://headlight-tournament-5.herokuapp.com/bots" decoder


decoder : Decoder (List Bot)
decoder =
    JD.field "Bots" (JD.list botDecoder)


botDecoder : Decoder Bot
botDecoder =
    JD.succeed Bot
        |> required "Id" JD.string
        |> required "Location" Location.xDecoder
        |> required "Location" Location.yDecoder
        |> required "Score" JD.int
        |> required "Claims" (JD.list JD.string)
