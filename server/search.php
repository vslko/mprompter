<?php

$data = array(
    array(  'id'	=> 1,
            'name'	=> 'Audi A4 Avant',
            'note'	=> 'Compact Executive Car: Estate/Wagon'
    ),
    array(  'id'	=> 2,
            'name'	=> 'Audi A4 Allroad',
            'note'	=> 'Compact Executive Car: Crossover Estate/Wagon'
    ),
    array(  'id'	=> 3,
            'name'	=> 'Audi A7',
            'note'	=> 'Executive Car: Sportback, 5-door Hatchback',
    ),
    array(  'id'	=> 4,
            'name'	=> 'Audi Q5',
            'note'	=> 'Compact Crossover SUV',
    ),
    array(  'id'	=> 5,
            'name'	=> 'BMW X5',
            'note'	=> 'BMW xDrive all-wheel drive',
    ),
    array(  'id'	=> 6,
            'name'	=> 'BMW X6',
            'note'	=> 'BMW xDrive all-wheel drive',
    ),
    array(  'id'	=> 7,
            'name'	=> 'Mercedes C200CDI',
            'note'	=> 'Common-rail diesel engine',
    ),
    array(  'id'	=> 8,
            'name'	=> 'Mercedes E320 4MATIC',
            'note'	=> 'The vehicle is equipped with all-wheel-drive',
    ),

);

$data = array(
    'success'    => true,
    'message'    => "Found ".count($data)."matches",
    'data'       => $data
);
die( json_encode($data) );

//q, count


?>