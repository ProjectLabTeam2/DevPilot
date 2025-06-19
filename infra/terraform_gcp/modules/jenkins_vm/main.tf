resource "google_compute_instance" "jenkins" {
  name         = "jenkins-master"
  machine_type = "e2-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 20
    }
  }

  network_interface {
    network    = var.network
    subnetwork = var.subnetwork
    access_config {}
  }

  tags = var.tags

  metadata = {
    ssh-keys = "ubuntu:${file("/home/john/.ssh/jenkins_gcp.pub")}"
  }
}
