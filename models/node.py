class Node:
    def __init__(self, id, x, y, value, claimed):
        self.id = id
        self.x = x
        self.y = y
        self.value = value
        self.claimed = claimed

    def __lt__(self, other):
        """Allows the claims heap to be sorted by node value."""
        return self.value < other.value