module Node exposing (Node, getNodes)

import Bot exposing (BotId)
import Http
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Pipeline exposing (required)
import Location exposing (X, Y)


type alias Node =
    { id : String
    , locationX : X
    , locationY : Y
    , value : Int
    , claimedBy : BotId
    }


getNodes : Http.Request (List Node)
getNodes =
    Http.get "https://headlight-tournament-5.herokuapp.com/nodes" decoder


decoder : Decoder (List Node)
decoder =
    JD.field "Nodes" (JD.list nodeDecoder)


nodeDecoder : Decoder Node
nodeDecoder =
    JD.succeed Node
        |> required "Id" JD.string
        |> required "Location" Location.xDecoder
        |> required "Location" Location.yDecoder
        |> required "Value" JD.int
        |> required "ClaimedBy" JD.string
