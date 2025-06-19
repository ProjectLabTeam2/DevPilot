resource "google_compute_network" "network" {
  name = "jenkins-network"
}

resource "google_compute_subnetwork" "subnet" {
  name          = "jenkins-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.network.id
  region        = var.region
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = google_compute_network.network.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = var.ssh_source_ranges
  target_tags   = ["jenkins"]
}

resource "google_compute_firewall" "allow_jenkins_ports" {
  name    = "allow-jenkins-http"
  network = google_compute_network.network.name

  allow {
    protocol = "tcp"
    ports    = ["8080", "50000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["jenkins"]
}

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = google_compute_network.network.name

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["jenkins"]
}

resource "google_compute_firewall" "allow_https" {
  name    = "allow-https"
  network = google_compute_network.network.name

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["jenkins"]
}
