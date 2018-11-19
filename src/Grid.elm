module Grid exposing (Cell, Grid, generateGrid)

import Location exposing (X, Y)


type alias Grid =
    List (List Cell)


type alias Cell =
    { x : X
    , y : Y
    }


generateGrid : Int -> Int -> Grid
generateGrid numRows numCols =
    let
        rows =
            List.range 0 (numRows - 1)

        columns =
            List.range 0 (numCols - 1)
    in
    rows
        |> List.map
            (\r ->
                List.map (\c -> Cell r c) columns
            )
