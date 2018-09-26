import unittest
from mars import helpers

class TestMars(unittest.TestCase):

    def optimal_move(self):
        output = helpers.optimal_move(50,50)

        self.assertTrue(len(output) > 0)

    def new_coordinates(self):
        output = helpers._new_coordinates(x,y,radius=1)

        self.assertTrue(len(output) == 8)

    def check_boundary(self):
        self.assertEqual(helpers._check_boundary(101), 100)
        self.assertEqual(helpers._check_boundary(50), 50)
        self.assertEqual(helpers._check_boundary(-3), 0)

    def calculate_scan_area(self):
        self.assertEqual(helpers._calculate_scan_area(2,98,radius=5), 36)
        self.assertEqual(helpers._calculate_scan_area(100,100,radius=5), 25)
        self.assertEqual(helpers._calculate_scan_area(50,50,radius=5), 100t)

if __name__ == '__main__':
    unittest.main()
